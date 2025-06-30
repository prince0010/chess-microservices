import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { NATS_SERVICE } from 'src/config';

import { Bot } from './entities/bot.entity';
import { BotUserRecordGame } from './entities/bot-user-record-game.entity';

import {
  CreateRecordBotUserGameDto,
  UpdateRecordBotUserGameDto,
} from './dto/create-record-bot-user-game.dto';
import { FindAllBotRecordGamesDto } from './dto/find-all-bot-record-games.dto';
import { ICountAndListBotRecordGames } from './interfaces/bot.interface';

@Injectable()
export class BotRecordGameService {
  constructor(
    // @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    @InjectRepository(Bot)
    private readonly botRepository: Repository<Bot>,
    @InjectRepository(BotUserRecordGame)
    private readonly botUserRecordGameRepository: Repository<BotUserRecordGame>,
  ) {}

  async saveGame(dto: CreateRecordBotUserGameDto): Promise<string> {
    const { userUid } = dto;
    try {
      const bot = await this.botRepository.findOneBy({ id: dto.botId });
      if (!bot) {
        throw new BadRequestException(`Bot with ID: ${dto.botId} not found`);
      }

      const game = this.botUserRecordGameRepository.create({
        bot,
        userUid,
        datePlayed: dto.datePlayed,
        pgn: dto.pgn,
        whitePlayer: dto.whitePlayer,
        blackPlayer: dto.blackPlayer,
        result: dto.result ?? '*',
        plyCount: dto.plyCount ?? 0,
        isGameFinished: dto.isGameFinished ?? false,
        currentFen: dto.currentFen,
      });

      await this.botUserRecordGameRepository.save(game);

      return `Bot game saved successfully`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAll(
    findAllBotRecordGamesDto: FindAllBotRecordGamesDto,
  ): Promise<ICountAndListBotRecordGames> {
    const {
      userUid,
      limit = 10,
      page = 1,
      id = null,
    } = findAllBotRecordGamesDto;

    const offset = (page - 1) * limit;

    const findOptions: FindManyOptions<BotUserRecordGame> = {
      where: { userUid },
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

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    try {
      const [games, total] =
        await this.botUserRecordGameRepository.findAndCount({
          ...findOptions,
          relations: { bot: true },
        });

      return {
        currentPage: page,
        total,
        games,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(recordId: number): Promise<BotUserRecordGame> {
    try {
      const botGameRecord = await this.botUserRecordGameRepository.findOne({
        where: { id: recordId },
        relations: { bot: true },
      });
      if (!botGameRecord) {
        throw new BadRequestException(
          `Bot game record by user with ID: ${recordId} not found.`,
        );
      }

      return botGameRecord;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async update(
    botRecordGameId: number,
    updateRecordBotUserGameDto: UpdateRecordBotUserGameDto,
  ): Promise<string> {
    const { userUid, ...restBot } = updateRecordBotUserGameDto;
    try {
      await this.findOne(botRecordGameId);

      const existingGame = await this.botUserRecordGameRepository.preload({
        id: botRecordGameId,
        ...restBot,
      });

      await this.botUserRecordGameRepository.save(existingGame!);

      return `Bot game record by user updated successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
