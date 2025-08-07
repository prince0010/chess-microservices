import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

import { TetrisUserHistory } from './entities/tetris-user-history.entity';

import { UpdateTetrisUserHistoryDto } from './dto/update-tetris-user-history.dto';
import { BestScoreByUserResponse, IRankingResponse } from './interfaces/index';
import { LessonNameAsGame } from 'src/enum';

@Injectable()
export class TetrisService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(TetrisUserHistory)
    private readonly tetrisUserHistoryRepository: Repository<TetrisUserHistory>,
  ) {}

  async findRanking(currentUserUid: number): Promise<IRankingResponse> {
    try {
      // verify if user is on table history
      const userRow = await this.tetrisUserHistoryRepository.findOneBy({
        userUid: currentUserUid,
      });
      if (!userRow || userRow?.bestScore === 0) {
        throw new BadRequestException(
          `User have not played Chess-Tetris Pieces game yet.`,
        );
      }

      const currentUserScore = userRow.bestScore;

      // Step 1: Get current user's rank
      const rawRank = await this.tetrisUserHistoryRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM tetris_user_history
        WHERE bestScore > ?
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: Get users around the current rank
      const offset = Math.max(currentRank - 7, 0); // rank - 1 is 0-indexed
      const limit = 13;

      const nearbyUsers = await this.tetrisUserHistoryRepository.query(
        `
        SELECT * FROM tetris_user_history
        ORDER BY bestScore DESC
        LIMIT ? OFFSET ?
        `,
        [limit, offset],
      );

      // Filter nearby (TypeORM doesn't support RANK() filters directly, so we filter in JS)
      const sliced = nearbyUsers.map((row: any, index: number) => ({
        ...row,
        position: offset + index + 1,
      }));

      // Step 3: Enrich with user names
      const userUids = sliced.map((row: any) => row.userUid);

      const users = await firstValueFrom(
        this.client.send('auth.find.usersByUids', { uids: userUids }),
      );

      const userMap = new Map(
        users.map((u: { uid: number; name: string }) => [u.uid, u.name]),
      );

      const result = sliced.map((row) => ({
        userUid: row.userUid,
        bestScore: row.bestScore,
        userName: userMap.get(row.userUid) || 'Unknown',
        position: +row.position,
      }));

      return {
        userUid: currentUserUid,
        ranking: result,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOneScore(userUid: number): Promise<BestScoreByUserResponse> {
    try {
      const tetrisUser = await this.tetrisUserHistoryRepository.findOneBy({
        userUid,
      });

      return {
        bestScore: tetrisUser ? tetrisUser.bestScore : 0,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateHistory(
    updateTetrisUserHistoryDto: UpdateTetrisUserHistoryDto,
  ): Promise<BestScoreByUserResponse> {
    const { userUid, score } = updateTetrisUserHistoryDto;
    try {
      const tetrisUserHistoryRow =
        await this.tetrisUserHistoryRepository.findOneBy({ userUid });

      // update
      if (tetrisUserHistoryRow) {
        // avoid unnecessary query update if score is less than their last score
        if (tetrisUserHistoryRow.bestScore > score) {
          return { bestScore: tetrisUserHistoryRow.bestScore };
        }

        await this.tetrisUserHistoryRepository.update(
          { id: tetrisUserHistoryRow.id },
          { bestScore: score },
        );
      } else {
        // create a new row
        const newRow = this.tetrisUserHistoryRepository.create({
          bestScore: score,
          userUid,
        });

        await this.tetrisUserHistoryRepository.save(newRow);
      }

      // STEP: enable lessonParent isGame with name "Tetris game"
      if (score >= 70) {
        const dataEnableLessonParent = {
          lessonParentName: LessonNameAsGame.TETRIS_GAME,
          userUid,
        };
        await firstValueFrom(
          this.client.send('lessonParent.enable.one', dataEnableLessonParent),
        );
      }

      // TODO: maybe update user panda points

      return { bestScore: score };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
