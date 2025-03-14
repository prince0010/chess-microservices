import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Bot } from './entities/bot.entity';
import { BotUserHistory } from './entities/bot-user-history.entity';

import { CreateBotDto, UpdateBotDto } from './dto/create-bot.dto';
import { BotDifficulty, ELO_RANGE } from 'src/enum';
import { FindAllBotsDto } from './dto/find-all-bots.dto';
import { ICountAndListBots } from './interfaces/bot.interface';

@Injectable()
export class BotService {
  constructor(
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
    @InjectRepository(BotUserHistory)
    private readonly botUserHistoryRepository: Repository<BotUserHistory>,
  ) {}

  async createOne(createBotDto: CreateBotDto): Promise<string> {
    const {
      difficulty,
      name,
      elo,
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

      const newBot = this.botRepository.create({
        difficulty,
        name,
        elo,
        description,
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
      limit = 10,
      page = 1,
      id = null,
      name = null,
      difficulty = null,
    } = findAllBotsDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<Bot> = {
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
      whereConditions.name = name;
    }
    if (difficulty) {
      whereConditions.difficulty = difficulty;
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [bots, total] = await this.botRepository.findAndCount(findOptions);

      return {
        currentPage: page,
        total,
        bots,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(id: number): Promise<Bot> {
    try {
      const bot = await this.botRepository.findOneBy({ id });
      if (!bot) {
        throw new BadRequestException(`Bot with ID: ${id} not found.`);
      }

      return bot;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async update(id: number, updateBotDto: UpdateBotDto): Promise<string> {
    const { name, elo, difficulty, ...restBot } = updateBotDto;
    try {
      const oldBot = await this.findOne(id);

      const existBotByName = await this.botRepository.findOneBy({ name });
      if (existBotByName && existBotByName.id !== id) {
        throw new BadRequestException(
          `Another Bot with name: ${name} already exists.`,
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
      await this.findOne(id);

      await this.botRepository.update({ id }, { isActive: false });

      return `Bot soft-deleted successfully.`;
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
}
