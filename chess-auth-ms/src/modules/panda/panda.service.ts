import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { NATS_SERVICE } from 'src/config';
import { AuthPanda } from './entities/auth-panda.entity';

import { UpdatePandaDto } from './dto/update-panda.dto';
import { UpdateUserPointsDto } from './dto/update-user-points.dto';
import { PandaAction, PandaPointsConsumedByAction, PandaState } from 'src/enum';
import { PandaActionResponse } from './interfaces';

@Injectable()
export class PandaService {
  constructor(
    @InjectRepository(AuthPanda)
    private readonly authPandaRepository: Repository<AuthPanda>,

    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  // findOne(id: number) {
  //   return `This action returns a #${id} panda`;
  // }

  async update(updatePandaDto: UpdatePandaDto): Promise<PandaActionResponse> {
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
      switch (action) {
        case PandaAction.FEED:
          pandaRow.lastFeedAt = now;
          spentPoints = PandaPointsConsumedByAction.POINTS_BY_FEED;
          break;
        case PandaAction.SLEEP:
          pandaRow.lastSleepAt = now;
          spentPoints = PandaPointsConsumedByAction.POINTS_BY_SLEEP;
          break;
        case PandaAction.BATH:
          pandaRow.lastBathAt = now;
          spentPoints = PandaPointsConsumedByAction.POINTS_BY_BATH;
          break;
        default:
          throw new BadRequestException(`Invalid panda action: ${action}`);
      }

      pandaRow.state = this.getPandaState(pandaRow);

      await this.authPandaRepository.save(pandaRow);

      // STEP subtract points of user
      const dataPoints: UpdateUserPointsDto = {
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
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private getPandaState(panda: AuthPanda): string {
    const now = new Date();
    const hoursSinceFeed =
      (now.getTime() - panda.lastFeedAt.getTime()) / 3600000;
    const hoursSinceSleep =
      (now.getTime() - panda.lastSleepAt.getTime()) / 3600000;
    const hoursSinceBath =
      (now.getTime() - panda.lastBathAt.getTime()) / 3600000;

    if (hoursSinceFeed > 24 && hoursSinceSleep > 24 && hoursSinceBath > 24) {
      return PandaState.NEGLECTED;
    }
    if (hoursSinceFeed > 12) return PandaState.HUNGRY;
    if (hoursSinceBath > 18) return PandaState.DIRTY;
    if (hoursSinceSleep > 16) return PandaState.SLEEPY;

    return PandaState.HAPPY;
  }
}
