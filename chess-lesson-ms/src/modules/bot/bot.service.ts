import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

import { Bot } from './entities/bot.entity';
import { BotUserHistory } from './entities/bot-user-history.entity';
import { botsDataSeed } from './seed/bot-data-seed';

import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';
import {
  BotDefaultFormula,
  BotDifficulty,
  BotUserGameResult,
  ELO_RANGE,
  LessonNameAsBot,
  TypeUserCounter,
} from 'src/enum';
import { FindAllBotsDto } from './dto/find-all-bots.dto';
import { CounterBotUserHistoryDto } from './dto/counter-bot-user-history.dto';
import { FindOneBotDto } from './dto/find-one-bot.dto';
import { UpdateUserPointsDto } from './dto/update-user-points.dto';
import {
  IBotWithHistoryByUser,
  ICountAndListBots,
  GameBotResponse,
} from './interfaces/bot.interface';

@Injectable()
export class BotService {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
    @InjectRepository(BotUserHistory)
    private readonly botUserHistoryRepository: Repository<BotUserHistory>,
  ) {}

  async generateAnimalBots(): Promise<string> {
    try {
      // seed data animal bots
      const data = botsDataSeed;
      await this.botRepository.insert(data);

      return 'All animal bots generated successfully';
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async createOne(createBotDto: CreateBotDto): Promise<string> {
    const {
      difficulty,
      name,
      elo,
      animal,
      avatar, // missing to handle images,
      description,
    } = createBotDto;

    try {
      const isValidElo = this.isValidEloForDifficulty(
        difficulty as BotDifficulty,
        elo,
      );

      if (!isValidElo) {
        throw new BadRequestException(
          `Invalid elo value with difficulty: ${difficulty} that accept the range: [${ELO_RANGE[difficulty].min}-${ELO_RANGE[difficulty].max}]`,
        );
      }

      const existsBot = await this.botRepository.findOneBy({ name });
      if (existsBot) {
        throw new BadRequestException(`Bot with name: ${name} already exists.`);
      }

      const existsBotByAnimal = await this.botRepository.findOneBy({ animal });
      if (existsBotByAnimal) {
        throw new BadRequestException(
          `Bot with animal: ${animal} already exists.`,
        );
      }

      // get the last row of bot repository to know how many points when win
      const lastBot = await this.botRepository.findOne({
        where: {},
        order: { id: 'DESC' },
      });

      const newBot = this.botRepository.create({
        difficulty,
        name,
        animal,
        elo,
        description,
        pointsWhenTied: 0,
        pointsWhenWin: lastBot ? lastBot.pointsWhenWin + 5 : 5,
      });

      await this.botRepository.save(newBot);

      return `Bot created successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAll(findAllBotsDto: FindAllBotsDto): Promise<ICountAndListBots> {
    const {
      userUid,
      limit = 10,
      page = 1,
      id = null,
      name = null,
      difficulty = null,
      isActive = true,
    } = findAllBotsDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<Bot> = {
      where: { isActive },
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
    if (name) {
      whereConditions.name = Like(`%${name}%`);
    }
    if (difficulty) {
      whereConditions.difficulty = difficulty;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [bots, total] = await this.botRepository.findAndCount({
        ...findOptions,
      });

      const botUserHistory = await this.botUserHistoryRepository.find({
        where: { userUid },
        relations: { bot: true },
      });

      // verify payment subscription before looping bots
      const subscriptionLifetime = await firstValueFrom(
        this.client.send(
          'paymentSubscription.levelsForLifeTime.active',
          userUid,
        ),
      ).catch(() => false);

      const subscription30Days = !subscriptionLifetime
        ? await firstValueFrom(
            this.client.send(
              'paymentSubscription.levelsFor30Days.active',
              userUid,
            ),
          ).catch(() => false)
        : false;

      const hasActiveSubscription = subscriptionLifetime || subscription30Days;

      // Map bots with user's game history
      let lastBotWasBeaten = true; // first bot needs to be enabled
      const botsWithHistory = bots.map((bot) => {
        let currentBotDisabled = !lastBotWasBeaten;
        if (hasActiveSubscription) {
          currentBotDisabled = false;
        }

        const userHistory = botUserHistory.find(
          (historyRow) => historyRow.bot.id === bot.id,
        );

        // update control variable for the next bot
        lastBotWasBeaten = userHistory ? userHistory.gameWon > 0 : false;

        return {
          id: bot.id,
          name: bot.name,
          animal: bot.animal,
          difficulty: bot.difficulty,
          description: bot.description,
          isActive: bot.isActive,
          elo: bot.elo,
          gameWon: userHistory?.gameWon ?? 0,
          gameLost: userHistory?.gameLost ?? 0,
          gameTied: userHistory?.gameTied ?? 0,
          disabled: currentBotDisabled,
        };
      });

      return {
        currentPage: page,
        total,
        bots: botsWithHistory,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(findOneBotDto: FindOneBotDto): Promise<IBotWithHistoryByUser> {
    const { userUid, botId } = findOneBotDto;
    try {
      const bot = await this.botRepository.findOneBy({ id: botId });

      if (!bot) {
        throw new BadRequestException(`Bot with ID: ${botId} not found.`);
      }

      const botWithUserHistory = await this.botUserHistoryRepository.findOne({
        where: { userUid, bot: { id: botId } },
        relations: { bot: true },
      });

      return {
        id: bot.id,
        name: bot.name,
        animal: bot.animal,
        difficulty: bot.difficulty,
        description: bot.description,
        isActive: bot.isActive,
        elo: bot.elo,
        gameWon: botWithUserHistory?.gameWon ?? 0,
        gameLost: botWithUserHistory?.gameLost ?? 0,
        gameTied: botWithUserHistory?.gameTied ?? 0,
        disabled: botWithUserHistory
          ? botWithUserHistory.gameWon > 0
            ? false
            : true
          : bot.elo !== 200, // if is the first time and the first bot (id = 1) needs to be enabled
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async update(id: number, updateBotDto: UpdateBotDto): Promise<string> {
    const { name, elo, animal, difficulty, ...restBot } = updateBotDto;
    try {
      const oldBot = await this.botRepository.findOneBy({ id });
      if (!oldBot) {
        throw new BadRequestException(`Bot with ID: ${id} not found.`);
      }

      const existBotByName = await this.botRepository.findOneBy({ name });
      if (existBotByName && existBotByName.id !== id) {
        throw new BadRequestException(
          `Another Bot with name: ${name} already exists.`,
        );
      }

      const existBotByAnimal = await this.botRepository.findOneBy({ animal });
      if (existBotByAnimal && existBotByAnimal.id !== id) {
        throw new BadRequestException(
          `Another Bot with animal: ${animal} already exists.`,
        );
      }

      if (difficulty !== oldBot.difficulty || elo !== oldBot.elo) {
        // verify if exist one
        const botUsers = await this.botUserHistoryRepository.find({
          where: { bot: { id } },
          relations: { bot: true },
        });

        if (botUsers.length) {
          throw new BadRequestException(
            `Not permitted to modify the difficulty or elo value field of this bot because some users already played it.`,
          );
        }

        if (elo && difficulty) {
          // verify elo is in the range of difficulty
          const isValidElo = this.isValidEloForDifficulty(
            difficulty as BotDifficulty,
            elo,
          );

          if (!isValidElo) {
            throw new BadRequestException(
              `Invalid elo value with difficulty: ${difficulty} that accept the range: [${ELO_RANGE[difficulty].min}-${ELO_RANGE[difficulty].max}]`,
            );
          }
        }
      }

      const botToUpdate = await this.botRepository.preload({
        id,
        name,
        animal,
        elo,
        difficulty,
        ...restBot,
      });

      await this.botRepository.save(botToUpdate!);

      return `Bot updated successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const bot = await this.botRepository.findOneBy({ id });
      if (!bot) {
        throw new BadRequestException(`Bot with ID: ${id} not found.`);
      }

      await this.botRepository.update({ id }, { isActive: false });

      return `Bot soft-deleted successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateHistoryByUser(
    counterBotUserHistoryDto: CounterBotUserHistoryDto,
  ): Promise<GameBotResponse> {
    const { result, botId, userUid } = counterBotUserHistoryDto;

    try {
      const fetchedBot = await this.botRepository.findOneBy({ id: botId });
      if (!fetchedBot) {
        throw new BadRequestException(`Bot with ID: ${botId} not found.`);
      }

      const botUserHistory = await this.botUserHistoryRepository.findOne({
        where: { bot: { id: botId }, userUid },
        relations: { bot: true },
      });

      let rowBotUser: BotUserHistory;
      if (botUserHistory) {
        rowBotUser = botUserHistory;
      } else {
        rowBotUser = this.botUserHistoryRepository.create({
          bot: fetchedBot,
          userUid,
          gameWon: 0,
          gameLost: 0,
          gameTied: 0,
        });
      }

      switch (result) {
        case BotUserGameResult.GAME_WON:
          rowBotUser.gameWon += 1;
          break;
        case BotUserGameResult.GAME_TIED:
          rowBotUser.gameTied += 1;
          break;
        case BotUserGameResult.GAME_LOST:
          rowBotUser.gameLost += 1;
          break;

        default:
          break;
      }

      await this.botUserHistoryRepository.save(rowBotUser);

      if (result === BotUserGameResult.GAME_LOST) {
        const user = await firstValueFrom(
          this.client.send('auth.findone.user', userUid),
        );

        return {
          message:
            'Bot game lost, no points earned. The next time you will beat it for sure.',
          lastPoints: user.points,
          earnedPoints: 0,
          counter: user.points,
        };
      }

      // Add bot result points to user counter
      const dataPoints: UpdateUserPointsDto = {
        uid: userUid,
        points:
          result === BotUserGameResult.GAME_WON
            ? rowBotUser.gameWon > 1
              ? 1
              : fetchedBot.pointsWhenWin // only add points the first time this user beat the bot, otherwise only add 1 point
            : fetchedBot.pointsWhenTied,
        typeUserCounter: TypeUserCounter.ANIMAL_BOT_COUNTER,
      };
      const { lastPoints, earnedPoints, counter } = await firstValueFrom(
        this.client.send('update.points.user', dataPoints),
      );

      // STEP: verify if enable lessonParent isBot with name "Defeat to Tik and Shelly"
      const [historyRows, count] =
        await this.botUserHistoryRepository.findAndCountBy({
          userUid,
        });
      let botsDefeated = 0;
      for (const botHistory of historyRows) {
        if (botHistory.gameWon > 0) {
          botsDefeated += 1;
        }
      }

      if (botsDefeated >= 2 && historyRows.length < 4) {
        const dataEnableLessonParent = {
          lessonParentName: LessonNameAsBot.DEFEAT_TO_TIK_AND_SHELLY,
          userUid,
        };
        await firstValueFrom(
          this.client.emit('lessonParent.enable.one', dataEnableLessonParent),
        );
      }

      return {
        message: 'Game bot counter for that user updated successfully',
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

  async countHowManyBotsDefeated(userUid: number): Promise<number> {
    try {
      let counter = 0;
      const [rowBots, count] =
        await this.botUserHistoryRepository.findAndCountBy({ userUid });

      for (const bot of rowBots) {
        if (bot.gameWon > 0) {
          counter += 1;
        }
      }

      return counter;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  // ====== helpers =======
  private isValidEloForDifficulty(
    difficulty: BotDifficulty,
    elo: number,
  ): boolean {
    const range = ELO_RANGE[difficulty];
    return elo >= range.min && elo <= range.max;
  }

  private calculatePointsWithBotFormula(result: string, elo: number): number {
    return (
      elo *
      BotDefaultFormula.K_FACTOR *
      (result === BotUserGameResult.GAME_WON
        ? BotDefaultFormula.GAME_WON
        : BotDefaultFormula.GAME_TIED)
    );
  }
}
