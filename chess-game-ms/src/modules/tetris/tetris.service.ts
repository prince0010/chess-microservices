import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TetrisUserHistory } from './entities/tetris-user-history.entity';

import { UpdateTetrisUserHistoryDto } from './dto/update-tetris-user-history.dto';
import { BestScoreByUserResponse } from './interfaces/tetris-user-history.interface';

@Injectable()
export class TetrisService {
  constructor(
    @InjectRepository(TetrisUserHistory)
    private readonly tetrisUserHistoryRepository: Repository<TetrisUserHistory>,
  ) {}

  findRanking() {
    try {
      // TODO: implement an optimize and efficient query to auth-ms here and add userName
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
