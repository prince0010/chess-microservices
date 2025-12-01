import { Controller, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CoachesService } from './coaches.service';

import { CreateCoachDto, UpdateCoachDto } from './dto/create-coach.dto';
import { FindAllCoachesDto } from './dto/find-all-coaches.dto';

@Controller()
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @MessagePattern('coach.create.one')
  create(@Payload() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @MessagePattern('coach.find.all')
  findAll(@Query() findAllCoachesDto: FindAllCoachesDto) {
    return this.coachesService.findAll(findAllCoachesDto);
  }

  @MessagePattern('coach.find.one')
  findOne(@Payload() id: number) {
    return this.coachesService.findOne(id);
  }

  @MessagePattern('coach.update.one')
  update(@Payload() updateCoachDto: UpdateCoachDto) {
    return this.coachesService.update(updateCoachDto);
  }

  @MessagePattern('coach.remove.one')
  remove(@Payload() id: number) {
    return this.coachesService.remove(id);
  }
}
