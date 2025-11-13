import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { NATS_SERVICE } from 'src/config';
import { AuthPanda } from './entities/auth-panda.entity';

import { UpdatePandaFunctionDto } from './dto/update-panda.dto';
import { UpdatePandaUserPointsDto } from './dto/update-panda-user-points.dto';
import { PandaFunction, PandaPointsConsumedByAction } from 'src/enum';
import { PandaFunctionResponse } from './interfaces';
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
        relations: { user: true },
      });

      if (!authPanda) {
        throw new BadRequestException(
          `User Panda with uid: ${userUid} not found on database.`,
        );
      }

      return authPanda;
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
      let spentPoints = 0;

      // STEP 1: find one
      const pandaRow = await this.findOne(userUid);

      // STEP 2: update feed and sleep values
      switch (pandaFunction) {
        case PandaFunction.SPEND_EXTRA_LIFE:
          if (pandaRow.feedValue >= 10) {
            pandaRow.feedValue -= 10;
          }
          break;
        case PandaFunction.SPEND_EXTRA_TIME:
          if (pandaRow.sleepValue >= 10) {
            pandaRow.sleepValue -= 10;
          }
          break;
        case PandaFunction.ADD_EXTRA_LIFE:
          if (pandaRow.feedValue <= 20) {
            pandaRow.feedValue += 10;
            spentPoints = PandaPointsConsumedByAction.POINTS_BY_FEED;
          }
          break;
        case PandaFunction.ADD_EXTRA_TIME:
          if (pandaRow.sleepValue <= 20) {
            pandaRow.sleepValue += 10;
            spentPoints = PandaPointsConsumedByAction.POINTS_BY_SLEEP;
          }
          break;

        default:
          break;
      }

      // STEP 3: subtract points of user
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

      const updatedPanda = await this.authPandaRepository.save(pandaRow);

      return {
        message: `Panda function executed successfully`,
        lastPoints,
        spentPoints,
        counter,
        panda: updatedPanda,
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

  // update lastCorrectPuzzleAt when player solve a puzzle
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
