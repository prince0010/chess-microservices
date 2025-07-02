import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { Bot } from './entities/bot.entity';
import { BotUserRecordGame } from './entities/bot-user-record-game.entity';

import { CreateRecordBotUserGameDto } from './dto/create-record-bot-user-game.dto';
import { FindAllBotRecordGamesDto } from './dto/find-all-bot-record-games.dto';
import { ICountAndListBotRecordGames } from './interfaces/bot.interface';
import { UpdateRecordBotUserGameDto } from './dto/update-record-bot-user-game.dto';

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

      const fullPgn = dto.isGameFinished ? this.generateFullPGN(dto) : '';

      const game = this.botUserRecordGameRepository.create({
        bot,
        userUid,
        datePlayed: dto.datePlayed,
        pgn: fullPgn,
        moves: dto.moves.join(' '),
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
      const existingBot = await this.findOne(botRecordGameId);
      if (existingBot.userUid !== userUid) {
        throw new BadRequestException(
          `This bot game is not property of this current authenticated user.`,
        );
      }

      if (existingBot.isGameFinished) {
        throw new BadRequestException(
          `Is not allowed to update a finished bot game.`,
        );
      }

      const fullPgn = restBot.isGameFinished
        ? this.generateFullPGN({ ...existingBot, ...restBot })
        : '';

      const existingGame = await this.botUserRecordGameRepository.preload({
        ...existingBot,
        ...restBot,
        pgn: fullPgn,
        moves: restBot.moves?.join(' ') ?? existingBot.moves,
      });

      await this.botUserRecordGameRepository.save(existingGame!);

      return `Bot game record updated successfully.`;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  private generateFullPGN(dto: any): string {
    if (!dto.isGameFinished) return '';

    // only create full PGN if game is finished
    const movesPgn = dto.moves.join(' ');

    const pgnHeaders = [
      `[Event "${'We Chess Bot Match'}"]`,
      `[Site "${'We Chess App'}"]`,
      `[Date "${dto.datePlayed}"]`,
      `[Round "?"]`,
      `[White "${dto.whitePlayer}"]`,
      `[Black "${dto.blackPlayer}"]`,
      `[Result "${dto.result ?? '*'}"]`,
      `[PlyCount "${dto.plyCount ?? dto.moves.length}"]`,
    ];

    const fullPgn = `${pgnHeaders.join('\n')}\n\n${movesPgn} ${dto.result ?? '*'}`;

    return fullPgn;
  }
}
