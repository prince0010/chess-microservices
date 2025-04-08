import {
  Body,
  Controller,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { AuthGuard } from 'src/guards/auth.guard';
import { NATS_SERVICE } from 'src/config';

import { UpdatePandaDto } from './dto/update-panda.dto';

@Controller('panda')
export class PandaController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Patch('/')
  update(@Body() updatePandaDto: UpdatePandaDto, @Req() req: any) {
    const payload = {
      ...updatePandaDto,
      userUid: +req.user.uid,
    };

    return this.client.send('update.one.panda', payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
