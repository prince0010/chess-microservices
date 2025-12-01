import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Coach } from './entities/coach.entity';
import { CoachesController } from './coaches.controller';
import { CoachesService } from './coaches.service';

@Module({
  controllers: [CoachesController],
  providers: [CoachesService],
  imports: [TypeOrmModule.forFeature([Coach])],
  exports: [TypeOrmModule],
})
export class CoachesModule {}
