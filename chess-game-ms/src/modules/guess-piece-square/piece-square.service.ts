import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

import { PieceSquareLevel } from './entities/piece-square-level.entity';
import { PieceSquareLevelCompleted } from './entities/piece-square-level-completed.entity';

import { CompletePieceSquareLevelDto } from './dto/complete-piece-square-level.dto';
import { FindAllPieceSquareLevelsDto } from './dto/find-all-piece-square-levels.dto';
import {
  CompletePieceSquareLevelResponse,
  ICountAndListPieceSquareLevels,
  IPieceSquareLevel,
} from './interfaces';
import { UpdateUserPointsDto } from 'src/interfaces';

@Injectable()
export class PieceSquareService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    @InjectRepository(PieceSquareLevel)
    private readonly pieceSquareLevelRepository: Repository<PieceSquareLevel>,

    @InjectRepository(PieceSquareLevelCompleted)
    private readonly pieceSquareLevelCompletedRepository: Repository<PieceSquareLevelCompleted>,
  ) {}

  async generate32Levels(): Promise<string> {
    try {
      const pieceSquareLevelsExisting =
        await this.pieceSquareLevelRepository.find({});

      if (pieceSquareLevelsExisting && pieceSquareLevelsExisting.length) {
        throw new BadRequestException(
          'Not need to create 32 Levels again, they already exist.',
        );
      }

      for (let i = 0; i < 32; i++) {
        const levelName = `Level ${i + 1}`;
        const newPieceSquareLevel = this.pieceSquareLevelRepository.create({
          level: levelName,
          points: i + 1,
        });

        await this.pieceSquareLevelRepository.save(newPieceSquareLevel);
      }

      return '32 Levels generated successfully';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAll(
    findAllPieceSquareLevelsDto: FindAllPieceSquareLevelsDto,
  ): Promise<ICountAndListPieceSquareLevels> {
    const {
      limit = 10,
      page = 1,
      userUid,
      id = null,
      level = null,
    } = findAllPieceSquareLevelsDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<PieceSquareLevel> = {
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
    };

    const whereConditions: any = {};
    if (id) {
      whereConditions.id = id;
    }
    if (level) {
      whereConditions.level = level;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [pieceSquareLevels, total] =
        await this.pieceSquareLevelRepository.findAndCount(findOptions);

      const levelsObjects: IPieceSquareLevel[] = [];
      let previousLevelWasCompleted: boolean = true;

      for (const [index, levelEntity] of pieceSquareLevels.entries()) {
        // verify if level completed or not
        const levelWasCompleted =
          await this.pieceSquareLevelCompletedRepository.findOne({
            where: { userUid, pieceSquareLevel: { id: levelEntity.id } },
            relations: { pieceSquareLevel: true },
          });

        levelsObjects.push({
          id: levelEntity.id,
          level: levelEntity.level,
          disabled: !previousLevelWasCompleted,
        });

        previousLevelWasCompleted = levelWasCompleted ? true : false;
      }

      return {
        currentPage: page,
        total,
        levels: levelsObjects,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOneLevel(pieceSquareLevelId: number): Promise<PieceSquareLevel> {
    try {
      const pieceSquareLevel = await this.pieceSquareLevelRepository.findOneBy({
        id: pieceSquareLevelId,
      });

      if (!pieceSquareLevel) {
        throw new BadRequestException(
          `Piece Square level with ID: ${pieceSquareLevelId} not found.`,
        );
      }

      return pieceSquareLevel;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async completeLevel(
    completePieceSquareLevelDto: CompletePieceSquareLevelDto,
  ): Promise<CompletePieceSquareLevelResponse> {
    const { userUid, pieceSquareLevelId } = completePieceSquareLevelDto;
    try {
      const pieceSquareLevelEntity =
        await this.findOneLevel(pieceSquareLevelId);

      const completedLevelExisting =
        await this.pieceSquareLevelCompletedRepository.findOne({
          where: { userUid, pieceSquareLevel: { id: pieceSquareLevelId } },
          relations: { pieceSquareLevel: true },
        });

      let earnedPointByUser = 0;
      if (!completedLevelExisting) {
        // create new one row
        const newCompletedLevel =
          this.pieceSquareLevelCompletedRepository.create({
            pieceSquareLevel: pieceSquareLevelEntity,
            userUid,
          });

        await this.pieceSquareLevelCompletedRepository.save(newCompletedLevel);

        earnedPointByUser = pieceSquareLevelEntity.points;
      }

      // Add earned points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points: earnedPointByUser,
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      return {
        lastPoints,
        earnedPoints,
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
