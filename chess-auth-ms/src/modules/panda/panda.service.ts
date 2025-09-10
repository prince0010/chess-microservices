import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { NATS_SERVICE } from 'src/config';
import { AuthPanda } from './entities/auth-panda.entity';

import { UpdatePandaDto } from './dto/update-panda.dto';
import { UpdatePandaUserPointsDto } from './dto/update-panda-user-points.dto';
import { PandaAction, PandaPointsConsumedByAction, PandaState } from 'src/enum';
import { PandaActionResponse } from './interfaces';
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

      const now = new Date();
      let spentPoints = 0;
      let someActionIsFull = false; // to avoid spent user points
      switch (action) {
        case PandaAction.FEED:
          pandaRow.lastFeedAt = now;
          spentPoints = PandaPointsConsumedByAction.POINTS_BY_FEED;
          if (pandaRow.feedValue === 100) {
            someActionIsFull = true;
          }
          break;
        case PandaAction.SLEEP:
          pandaRow.lastSleepAt = now;
          spentPoints = PandaPointsConsumedByAction.POINTS_BY_SLEEP;
          if (pandaRow.sleepValue === 100) {
            someActionIsFull = true;
          }
          break;
        case PandaAction.BATH:
          pandaRow.lastBathAt = now;
          spentPoints = PandaPointsConsumedByAction.POINTS_BY_BATH;
          if (pandaRow.bathValue === 100) {
            someActionIsFull = true;
          }
          break;
        default:
          throw new BadRequestException(`Invalid panda action: ${action}`);
      }

      if (spentPoints > pandaRow.user.points) {
        return {
          message: `Insufficient points to ${action} Panda`,
          lastPoints: pandaRow.user.points,
          spentPoints: 0,
          counter: pandaRow.user.points,
          panda: pandaRow,
        };
      }

      // avoid subtract points to user and avoid update panda stateValues
      if (someActionIsFull) {
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
    pandaRow.feedValue = this.calculateTimeBasedValue(pandaRow.lastFeedAt);
    pandaRow.sleepValue = this.calculateTimeBasedValue(pandaRow.lastSleepAt);
    pandaRow.bathValue = this.calculateTimeBasedValue(pandaRow.lastBathAt);

    return pandaRow;
  }

  private calculateTimeBasedValue(lastActionAt: Date): number {
    const now = new Date();
    const hoursPassed =
      (now.getTime() - new Date(lastActionAt).getTime()) / (1000 * 60 * 60);

    const value = 100 - hoursPassed * (100 / 24);
    return Math.max(0, Math.round(value)); // Clamp to 0 and round
  }

  private getPandaState(panda: AuthPanda): string {
    let pandaState = PandaState.HAPPY;

    // Build an array of state-value pairs only for values below 50
    const stateValues: { state: string; value: number }[] = [];

    if (panda.feedValue < 50) {
      stateValues.push({ state: PandaState.HUNGRY, value: panda.feedValue });
    }

    if (panda.sleepValue < 50) {
      stateValues.push({ state: PandaState.SLEEPY, value: panda.sleepValue });
    }

    if (panda.bathValue < 50) {
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
