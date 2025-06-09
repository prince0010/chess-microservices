import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

import { GuessPieceSquareUserHistory } from './entities/guess-piece-square-user-history.entity';

import { UpdatePieceSquareUserHistoryDto } from './dto/update-piece-square-user-history.dto';
import { BestScoreByUserResponse, IRankingResponse } from './interfaces/index';

@Injectable()
export class PieceSquareService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(GuessPieceSquareUserHistory)
    private readonly guessPieceSquareUserHistoryRepository: Repository<GuessPieceSquareUserHistory>,
  ) {}

  async findRanking(currentUserUid: number): Promise<IRankingResponse> {
    try {
      // verify if user is on table history
      const userRow =
        await this.guessPieceSquareUserHistoryRepository.findOneBy({
          userUid: currentUserUid,
        });
      if (!userRow || userRow?.bestScore === 0) {
        throw new BadRequestException(
          `User have not played Guess Piece-Square game yet.`,
        );
      }

      const currentUserScore = userRow.bestScore;

      // Step 1: Get current user's rank
      const rawRank = await this.guessPieceSquareUserHistoryRepository.query(
        `
        SELECT COUNT(*) + 1 AS rank
        FROM guess_piece_square_user_history
        WHERE bestScore > ?
        `,
        [currentUserScore],
      );

      const currentRank = parseInt(rawRank[0]?.rank ?? '1', 10);

      // Step 2: Get users around the current rank
      const offset = Math.max(currentRank - 7, 0); // rank - 1 is 0-indexed
      const limit = 13;

      const nearbyUsers =
        await this.guessPieceSquareUserHistoryRepository.query(
          `
          SELECT * FROM guess_piece_square_user_history
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
      const guessPieceSquareUser =
        await this.guessPieceSquareUserHistoryRepository.findOneBy({
          userUid,
        });

      return {
        bestScore: guessPieceSquareUser ? guessPieceSquareUser.bestScore : 0,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateHistory(
    updatePieceSquareUserHistoryDto: UpdatePieceSquareUserHistoryDto,
  ): Promise<BestScoreByUserResponse> {
    const { userUid, score } = updatePieceSquareUserHistoryDto;
    try {
      const pieceSquareUserHistoryRow =
        await this.guessPieceSquareUserHistoryRepository.findOneBy({ userUid });

      // update
      if (pieceSquareUserHistoryRow) {
        // avoid unnecessary query update if score is less than their last score
        if (pieceSquareUserHistoryRow.bestScore > score) {
          return { bestScore: pieceSquareUserHistoryRow.bestScore };
        }

        await this.guessPieceSquareUserHistoryRepository.update(
          { id: pieceSquareUserHistoryRow.id },
          { bestScore: score },
        );
      } else {
        // create a new row
        const newRow = this.guessPieceSquareUserHistoryRepository.create({
          bestScore: score,
          userUid,
        });

        await this.guessPieceSquareUserHistoryRepository.save(newRow);
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
