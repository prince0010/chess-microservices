import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';

import { Coach } from './entities/coach.entity';

import { CreateCoachDto, UpdateCoachDto } from './dto/create-coach.dto';
import { FindAllCoachesDto } from './dto/find-all-coaches.dto';
import { IMessage } from 'src/interfaces';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
  ) {}

  async create(dto: CreateCoachDto): Promise<IMessage> {
    const { name } = dto;

    try {
      const duplicateCoachName = await this.coachRepository.findOneBy({ name });
      if (duplicateCoachName) {
        throw new BadRequestException(
          `Already exists a coach with name: ${name}`,
        );
      }

      await this.coachRepository.save({ ...dto });

      return { msg: `New coach with name: ${name} created successfully` };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findAll(dto: FindAllCoachesDto) {
    const { limit = 12, page = 1, query = null, isActive = null } = dto;
    const offset = (page - 1) * limit;

    const qb = this.coachRepository
      .createQueryBuilder('coach')
      .where({})
      .take(limit)
      .skip(offset)
      .orderBy('coach.name', 'ASC');

    if (query) {
      qb.andWhere(
        `(
          LOWER(coach.name) LIKE LOWER(:search)
          OR LOWER(coach.chessTitle) LIKE LOWER(:search)
        )`,
        { search: `%${query}%` },
      );
    }

    if (isActive !== null) {
      const activeValue = isActive === 'YES';
      qb.andWhere('coach.isActive = :isActive', { isActive: activeValue });
    }

    try {
      const [coaches, total] = await qb.getManyAndCount();

      return {
        total,
        page,
        coaches,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const coach = await this.coachRepository.findOne({
        where: { id },
      });
      if (!coach) {
        throw new RpcException({
          status: 401,
          message: `Coach not found with ID: ${id}`,
        });
      }

      return coach;
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async update(dto: UpdateCoachDto): Promise<IMessage> {
    const { id, name = null } = dto;

    try {
      const coach = await this.findOne(id);

      // avoid coach name duplicity
      if (name) {
        const existsCoachByName = await this.coachRepository.findOneBy({
          name,
        });
        if (existsCoachByName && existsCoachByName.id !== id) {
          throw new BadRequestException(
            `Already exists a coach with name: ${name}`,
          );
        }
      }

      const updatedCoach = await this.coachRepository.preload({
        ...coach,
        ...dto,
      });

      await this.coachRepository.save(updatedCoach);

      return { msg: `Coach with name: ${name} updated successfully.` };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async remove(id: number): Promise<IMessage> {
    const coach = await this.findOne(id);

    await this.coachRepository.update({ id }, { isActive: false });

    return { msg: `Coach with name: ${coach.name} removed successfully.` };
  }
}
