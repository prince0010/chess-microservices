import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Coach } from './entities/coach.entity';
import { CreateCoachDto, UpdateCoachDto } from './dto/create-coach.dto';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private readonly coachRepository: Repository<Coach>,
  ) {}

  async create(createCoachDto: CreateCoachDto) {
    const coach = this.coachRepository.create(createCoachDto);
    return await this.coachRepository.save(coach);
  }

  async findAll() {
    return await this.coachRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const coach = await this.coachRepository.findOne({ where: { id } });

    if (!coach) throw new NotFoundException(`Coach #${id} not found`);

    return coach;
  }

  async update(updateCoachDto: UpdateCoachDto) {
    const { id, ...changes } = updateCoachDto;

    const coach = await this.findOne(id); // ensures exists

    Object.assign(coach, changes);

    return await this.coachRepository.save(coach);
  }

  async remove(id: number) {
    const coach = await this.findOne(id);

    await this.coachRepository.remove(coach);

    return { message: `Coach #${id} removed` };
  }
}
