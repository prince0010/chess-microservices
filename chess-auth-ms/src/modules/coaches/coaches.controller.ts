import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CoachesService } from './coaches.service';

import { CreateCoachDto, UpdateCoachDto } from './dto/create-coach.dto';

@Controller()
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @MessagePattern('createCoach')
  create(@Payload() createCoachDto: CreateCoachDto) {
    return this.coachesService.create(createCoachDto);
  }

  @MessagePattern('findAllCoaches')
  findAll() {
    return this.coachesService.findAll();
  }

  @MessagePattern('findOneCoach')
  findOne(@Payload() id: number) {
    return this.coachesService.findOne(id);
  }

  @MessagePattern('updateCoach')
  update(@Payload() updateCoachDto: UpdateCoachDto) {
    return this.coachesService.update(updateCoachDto);
  }

  @MessagePattern('removeCoach')
  remove(@Payload() id: number) {
    return this.coachesService.remove(id);
  }
}
