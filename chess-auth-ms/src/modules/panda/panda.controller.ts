import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PandaService } from './panda.service';
import { UpdatePandaDto } from './dto/update-panda.dto';

@Controller()
export class PandaController {
  constructor(private readonly pandaService: PandaService) {}

  @MessagePattern('find.one.panda')
  findOne(@Payload() userUid: number) {
    return this.pandaService.findOne(userUid);
  }

  @MessagePattern('update.one.panda') // main endpoint to feed, sleep and bath panda
  update(@Payload() updatePandaDto: UpdatePandaDto) {
    return this.pandaService.updateByAction(updatePandaDto);
  }

  @MessagePattern('decrement.pandaPoints.dueToHelp') // at frontend sometimes panda help player
  subtractPointsDueToPandaHelp(@Payload() userUid: number) {
    return this.pandaService.subtractPointsDueToPandaHelp(userUid);
  }
}
