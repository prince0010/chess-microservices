import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PandaService } from './panda.service';
import { UpdatePandaFunctionDto } from './dto/update-panda.dto';

@Controller()
export class PandaController {
  constructor(private readonly pandaService: PandaService) {}

  @MessagePattern('find.one.panda')
  findOne(@Payload() userUid: number) {
    return this.pandaService.findOne(userUid);
  }

  // get values of extra life (feedValue) or extra time(sleepValue)
  @MessagePattern('find.stateValues.panda')
  getStateValues(@Payload() userUid: number) {
    return 'Not implemented at the moment';
  }

  // NOT USED ANYMORE - INSTEAD ALL IS HANDLED IN updateFunction
  // @MessagePattern('update.one.panda') // main endpoint to feed, sleep and bath panda
  // update(@Payload() updatePandaDto: UpdatePandaDto) {
  //   return this.pandaService.updateByAction(updatePandaDto);
  // }

  // called from frontend when user spent extra life or extra time playing puzzles
  @MessagePattern('update.oneDueToFunction.panda')
  updateFunction(@Payload() updatePandaFunctionDto: UpdatePandaFunctionDto) {
    return this.pandaService.updateByFunction(updatePandaFunctionDto);
  }

  // called from lesson-ms when player made a correct puzzle
  @EventPattern('update.lastCorrectPuzzleAt.panda')
  updateLastCorrectPuzzleAt(@Payload() userUid: number) {
    return this.pandaService.updateLastCorrectPuzzleAt(userUid);
  }

  @MessagePattern('decrement.pandaPoints.dueToHelp') // at frontend sometimes panda help player
  subtractPointsDueToPandaHelp(
    @Payload() data: { userUid: number; points: number },
  ) {
    return this.pandaService.subtractPointsDueToPandaHelp(
      data.userUid,
      data.points,
    );
  }
}
