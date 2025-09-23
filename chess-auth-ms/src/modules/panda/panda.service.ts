import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { NATS_SERVICE } from 'src/config';
import { AuthPanda } from './entities/auth-panda.entity';

import { UpdatePandaDto, UpdatePandaFunctionDto } from './dto/update-panda.dto';
import { UpdatePandaUserPointsDto } from './dto/update-panda-user-points.dto';
import {
  PandaAction,
  PandaFunction,
  PandaPointsConsumedByAction,
  PandaState,
} from 'src/enum';
import { PandaActionResponse, PandaFunctionResponse } from './interfaces';
import { ISubtractPointsUser } from '../auth/interfaces';

@Injectable()
export class PandaService {
  constructor(
    @InjectRepository(AuthPanda)
    private readonly authPandaRepository: Repository<AuthPanda>,

    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  // update panda state values
  async findOne(userUid: number): Promise<AuthPanda> {
    try {
      const authPanda = await this.authPandaRepository.findOne({
        where: { user: { uid: userUid } },
      });

      if (!authPanda) {
        throw new BadRequestException(
          `User Panda with uid: ${userUid} not found on database.`,
        );
      }

      const pandaUpdated = this.updateStateValues(authPanda);

      return await this.authPandaRepository.save(pandaUpdated);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // this method is called from frontend when init SingleLessonXScreen component
  async getStateValues(userUid: number): Promise<PandaFunctionResponse> {
    try {
      const pandaRow = await this.findOne(userUid);

      return {
        extraLive: Math.min(3, Math.floor(pandaRow.feedValue / 10)),
        extraTime: Math.min(3, Math.floor(pandaRow.sleepValue / 10)),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateByFunction(
    updatePandaFunctionDto: UpdatePandaFunctionDto,
  ): Promise<PandaFunctionResponse> {
    const { userUid, function: pandaFunction } = updatePandaFunctionDto;
    try {
      // STEP 1: update state values
      const pandaRow = await this.findOne(userUid);

      // STEP 2: update feed and sleep values
      switch (pandaFunction) {
        case PandaFunction.SPEND_EXTRA_LIFE:
          if (pandaRow.feedValue > 9) {
            pandaRow.feedValue -= 10;
          }
          break;
        case PandaFunction.SPEND_EXTRA_TIME:
          if (pandaRow.sleepValue > 9) {
            pandaRow.sleepValue -= 10;
          }
          break;
        case PandaFunction.ADD_EXTRA_LIFE:
          if (pandaRow.feedValue < 21) {
            pandaRow.feedValue += 10;
          }
          break;
        case PandaFunction.ADD_EXTRA_TIME:
          if (pandaRow.sleepValue < 21) {
            pandaRow.sleepValue += 10;
          }
          break;

        default:
          break;
      }

      const updatedPanda = await this.authPandaRepository.save(pandaRow);

      return {
        extraLive: Math.min(3, Math.floor(updatedPanda.feedValue / 10)),
        extraTime: Math.min(3, Math.floor(updatedPanda.sleepValue / 10)),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateLastCorrectPuzzleAt(userUid: number): Promise<void> {
    try {
      const pandaRow = await this.authPandaRepository.findOne({
        where: { user: { uid: userUid } },
        relations: { user: true },
      });

      if (!pandaRow) {
        throw new BadRequestException(
          `Panda user with UserUid: ${userUid} not found in database.`,
        );
      }

      pandaRow.lastCorrectPuzzleAt = new Date();

      await this.authPandaRepository.save(pandaRow);
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateByAction(
    updatePandaDto: UpdatePandaDto,
  ): Promise<PandaActionResponse> {
    const { userUid, action } = updatePandaDto;

    try {
      // STEP update auth_panda
      const pandaRow = await this.authPandaRepository.findOne({
        where: { user: { uid: userUid } },
        relations: { user: true },
      });

      if (!pandaRow) {
        throw new BadRequestException(
          `Panda user with UserUid: ${userUid} not found in database.`,
        );
      }

      let spentPoints = 0;
      let actionIsFull = true;
      if (pandaRow.user.points > 10) {
        switch (action) {
          case PandaAction.FEED:
            if (pandaRow.feedValue < 30) {
              spentPoints = PandaPointsConsumedByAction.POINTS_BY_FEED;
              pandaRow.feedValue = Math.min(30, pandaRow.feedValue + 10);
              actionIsFull = false;
            }
            break;
          case PandaAction.SLEEP:
            if (pandaRow.sleepValue < 30) {
              spentPoints = PandaPointsConsumedByAction.POINTS_BY_SLEEP;
              pandaRow.sleepValue = Math.min(30, pandaRow.sleepValue + 10);
              actionIsFull = false;
            }
            break;
          case PandaAction.BATH:
            if (pandaRow.bathValue < 30) {
              spentPoints = PandaPointsConsumedByAction.POINTS_BY_BATH;
              pandaRow.bathValue = Math.min(30, pandaRow.bathValue + 10);
              actionIsFull = false;
            }
            break;
          default:
            throw new BadRequestException(`Invalid panda action: ${action}`);
        }
      } else {
        if (spentPoints > pandaRow.user.points) {
          return {
            message: `Insufficient points to ${action} Panda`,
            lastPoints: pandaRow.user.points,
            spentPoints: 0,
            counter: pandaRow.user.points,
            panda: pandaRow,
          };
        }
      }

      // avoid subtract points to user and avoid update panda stateValues
      if (actionIsFull) {
        return {
          message: `Panda not needs to ${action}. So it is fully`,
          lastPoints: pandaRow.user.points,
          spentPoints: 0,
          counter: pandaRow.user.points,
          panda: pandaRow,
        };
      }

      pandaRow.state = this.getPandaState(pandaRow);

      // STEP update state values
      const pandaUpdatedWithStateValues = this.updateStateValues(pandaRow);

      const savedPanda = await this.authPandaRepository.save(
        pandaUpdatedWithStateValues,
      );

      // STEP subtract points of user
      const dataPoints: UpdatePandaUserPointsDto = {
        uid: userUid,
        points: spentPoints,
      };
      const {
        lastPoints,
        spentPoints: usedPoints,
        counter,
      } = await firstValueFrom(
        this.client.send('subtract.points.user', dataPoints),
      );

      return {
        message: `Panda action ${action} executed successfully`,
        lastPoints,
        spentPoints,
        counter,
        panda: savedPanda,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  public updateStateValues(pandaRow: AuthPanda): AuthPanda {
    const now = new Date();
    const MS_IN_DAY = 24 * 60 * 60 * 1000;

    const diffMs =
      now.getTime() - new Date(pandaRow.lastCorrectPuzzleAt).getTime();
    if (diffMs <= 0) return pandaRow;

    const periods = Math.floor(diffMs / MS_IN_DAY);
    if (periods > 0) {
      const deduction = periods * 10;

      pandaRow.feedValue = Math.max(0, pandaRow.feedValue - deduction);
      pandaRow.sleepValue = Math.max(0, pandaRow.sleepValue - deduction);
    }

    return pandaRow;
  }

  private getPandaState(panda: AuthPanda): string {
    let pandaState = PandaState.HAPPY;

    // Build an array of state-value pairs only for values below 10
    const stateValues: { state: string; value: number }[] = [];

    if (panda.feedValue < 10) {
      stateValues.push({ state: PandaState.HUNGRY, value: panda.feedValue });
    }

    if (panda.sleepValue < 10) {
      stateValues.push({ state: PandaState.SLEEPY, value: panda.sleepValue });
    }

    if (panda.bathValue < 10) {
      stateValues.push({ state: PandaState.DIRTY, value: panda.bathValue });
    }

    if (stateValues.length === 0) {
      return pandaState; // Panda is happy
    }

    // Find the minimum value
    const minValue = Math.min(...stateValues.map((s) => s.value));

    // Get all states that match this minimum value
    const worstStates = stateValues.filter((s) => s.value === minValue);

    // Randomly choose if there's a tie
    const chosen = worstStates[Math.floor(Math.random() * worstStates.length)];

    return chosen.state;
  }

  async subtractPointsDueToPandaHelp(
    userUid: number,
    points: number,
  ): Promise<ISubtractPointsUser> {
    try {
      const dataPoints: UpdatePandaUserPointsDto = {
        uid: userUid,
        points,
      };

      const { lastPoints, spentPoints, counter } = await firstValueFrom(
        this.client.send('subtract.points.user', dataPoints),
      );

      return {
        lastPoints,
        spentPoints,
        counter,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
