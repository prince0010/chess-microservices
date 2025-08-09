import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';

import { WorldChessChampionLevel } from './entities/world-chess-champion-level.entity';
import { WorldChessChampionLevelCompleted } from './entities/world-chess-champion-level-completed.entity';
import { WorldChessChampionGame } from './entities/world-chess-champion-game.entity';

import { parseWorldChessChampionsPgnFile } from '../../utils/world-chess-champion-pgn-parser';

import { FindAllWorldChessChampionLevelsDto } from './dto/find-all-world-chess-champion-levels.dto';
import { FindOneWorldChessChampionLevelByUserDto } from './dto/find-one-world-chess-champion-level.dto';
import { CompleteWorldChessChampionLevelDto } from './dto/complete-world-chess-champion-level.dto';
import { RunFileSeedWorldChessChampionDto } from './dto/run-file-seed-world-chess-champion.dto';
import { UpdateUserPointsDto } from 'src/interfaces';
import {
  CompleteWorldChessChampionLevelResponse,
  ICountAndListWorldChessChampionLevels,
  IFindOneWorldChessChampionLevelResponse,
  IWorldChessChampionLevel,
} from './interfaces';
import { LessonNameAsGame } from 'src/enum';

@Injectable()
export class WorldChessChampionService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

    private dataSource: DataSource,

    @InjectRepository(WorldChessChampionGame)
    private readonly worldChessChampionGameRepository: Repository<WorldChessChampionGame>,

    @InjectRepository(WorldChessChampionLevel)
    private readonly worldChessChampionLevelRepository: Repository<WorldChessChampionLevel>,

    @InjectRepository(WorldChessChampionLevelCompleted)
    private readonly worldChessChampionLevelCompletedRepository: Repository<WorldChessChampionLevelCompleted>,
  ) {}

  async generate57Levels(): Promise<string> {
    try {
      const worldChessChampionLevelsExisting =
        await this.worldChessChampionLevelRepository.find({});

      if (
        worldChessChampionLevelsExisting &&
        worldChessChampionLevelsExisting.length
      ) {
        throw new BadRequestException(
          'Not need to create 57 World Chess Champion Levels again, they already exist.',
        );
      }

      for (let i = 0; i < 57; i++) {
        const levelName = `Level ${i + 1}`;
        const newWorldChessChampionLevel =
          this.worldChessChampionLevelRepository.create({
            level: levelName,
            points: i + 1,
          });

        await this.worldChessChampionLevelRepository.save(
          newWorldChessChampionLevel,
        );
      }

      return '57 World Chess Champion Levels generated successfully';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async generatePGNGames(
    runFileSeedWorldChessChampionDto: RunFileSeedWorldChessChampionDto,
  ): Promise<string> {
    const { filename } = runFileSeedWorldChessChampionDto;

    try {
      const worldChessChampionGameRepository = this.dataSource.getRepository(
        WorldChessChampionGame,
      );

      let pathFile: string = `/usr/src/app/files/${filename}`;

      // Parse PGN file
      const games = parseWorldChessChampionsPgnFile(pathFile);

      if (games.length === 0) {
        throw new BadRequestException(
          `PGN World Chess Champion file with name: ${filename} is empty. No content inside that PGN file`,
        );
      }

      // Insert world chess champion games into database
      await worldChessChampionGameRepository.insert(games);

      return `World Chess Champion file with name: ${filename} inserted on database successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAll(
    findAllWorldChessChampionLevelsDto: FindAllWorldChessChampionLevelsDto,
  ): Promise<ICountAndListWorldChessChampionLevels> {
    const {
      limit = 10,
      page = 1,
      userUid,
      id = null,
      level = null,
    } = findAllWorldChessChampionLevelsDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<WorldChessChampionLevel> = {
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
      const [worldChessChampionLevels, total] =
        await this.worldChessChampionLevelRepository.findAndCount(findOptions);

      const levelsObjects: IWorldChessChampionLevel[] = [];
      let previousLevelWasCompleted: boolean = true;

      for (const [index, levelEntity] of worldChessChampionLevels.entries()) {
        // verify if level completed or not
        const levelWasCompleted =
          await this.worldChessChampionLevelCompletedRepository.findOne({
            where: { userUid, worldChessChampionLevel: { id: levelEntity.id } },
            relations: { worldChessChampionLevel: true },
          });

        levelsObjects.push({
          id: levelEntity.id,
          level: levelEntity.level,
          timesHasBeenCompleted: levelWasCompleted?.counter ?? 0,
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

  async findOneLevel(
    findOneWorldChessChampionLevelByUserDto: FindOneWorldChessChampionLevelByUserDto,
  ): Promise<IFindOneWorldChessChampionLevelResponse> {
    const { worldChessChampionLevelId, userUid } =
      findOneWorldChessChampionLevelByUserDto;

    try {
      const worldChessChampionLevelEntity =
        await this.worldChessChampionLevelRepository.findOneBy({
          id: worldChessChampionLevelId,
        });
      if (!worldChessChampionLevelEntity) {
        throw new BadRequestException(
          `World Chess Champion level with ID: ${worldChessChampionLevelId} not found.`,
        );
      }

      const worldChessChampionGame = await this.findRandomGame(
        worldChessChampionLevelId,
      );

      const worldChessChampionLevelCompletedByUserRow =
        await this.worldChessChampionLevelCompletedRepository.findOne({
          where: {
            worldChessChampionLevel: { id: worldChessChampionLevelId },
            userUid,
          },
          relations: { worldChessChampionLevel: true },
        });

      return {
        id: worldChessChampionLevelEntity.id,
        level: worldChessChampionLevelEntity.level,
        game: worldChessChampionGame,
        points: worldChessChampionLevelEntity.points,
        timesHasBeenCompleted:
          worldChessChampionLevelCompletedByUserRow?.counter ?? 0,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async countHowManyLevelsCompleted(userUid: number): Promise<number> {
    try {
      const [levels, count] =
        await this.worldChessChampionLevelCompletedRepository.findAndCountBy({
          userUid,
        });

      return count;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async completeLevel(
    completeWorldChessChampionLevelDto: CompleteWorldChessChampionLevelDto,
  ): Promise<CompleteWorldChessChampionLevelResponse> {
    const { userUid, worldChessChampionLevelId } =
      completeWorldChessChampionLevelDto;
    try {
      const worldChessChampionLevelEntity =
        await this.worldChessChampionLevelRepository.findOneBy({
          id: worldChessChampionLevelId,
        });

      if (!worldChessChampionLevelEntity) {
        throw new BadRequestException(
          `World Chess Champion level with ID: ${worldChessChampionLevelId} not found.`,
        );
      }

      const completedLevelExisting =
        await this.worldChessChampionLevelCompletedRepository.findOne({
          where: {
            userUid,
            worldChessChampionLevel: { id: worldChessChampionLevelId },
          },
          relations: { worldChessChampionLevel: true },
        });

      let earnedPointByUser = 0;
      if (!completedLevelExisting) {
        // create new one row
        const newCompletedLevel =
          this.worldChessChampionLevelCompletedRepository.create({
            worldChessChampionLevel: worldChessChampionLevelEntity,
            userUid,
            counter: 1,
          });

        await this.worldChessChampionLevelCompletedRepository.save(
          newCompletedLevel,
        );

        earnedPointByUser = worldChessChampionLevelEntity.points;
      } else if (completedLevelExisting.counter < 10) {
        // update counter
        await this.worldChessChampionLevelCompletedRepository.update(
          { id: completedLevelExisting.id },
          { counter: completedLevelExisting.counter + 1 },
        );

        earnedPointByUser = worldChessChampionLevelEntity.points;
      } else {
        // update counter
        await this.worldChessChampionLevelCompletedRepository.update(
          { id: completedLevelExisting.id },
          { counter: completedLevelExisting.counter + 1 },
        );
      }

      // Add earned points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points: earnedPointByUser,
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      // STEP: enable lessonParent isGame with name "World Chess Champion Game"
      const [levels, count] =
        await this.worldChessChampionLevelCompletedRepository.findAndCountBy({
          userUid,
        });
      if (count > 2) {
        const dataEnableLessonParent = {
          lessonParentName: LessonNameAsGame.MEMORY_TESTER_GAME,
          userUid,
        };
        await firstValueFrom(
          this.client.emit('lessonParent.enable.one', dataEnableLessonParent),
        );
      }

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

  private async findRandomGame(
    levelId: number,
  ): Promise<WorldChessChampionGame> {
    // 1. Get the total count of all available challenges/games
    const totalChallenges = await this.worldChessChampionGameRepository.count();

    if (totalChallenges === 0) {
      throw new BadRequestException(
        'No World Chess Champion games available in the database.',
      );
    }

    let suitableGame: WorldChessChampionGame | null = null;

    while (!suitableGame) {
      const randomIndex = Math.floor(Math.random() * totalChallenges);

      const [game] = await this.worldChessChampionGameRepository.find({
        take: 1,
        skip: randomIndex,
      });

      if (!game) continue;

      const moveCount = game.moves.split(' ').length;

      // Ensure the game has at least as many moves as required by the levelId
      if (moveCount >= levelId) {
        suitableGame = game;
      }
    }

    return suitableGame;
  }
}
