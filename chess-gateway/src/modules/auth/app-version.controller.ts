import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('app-version')
export class AppVersionController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Get('/check')
  findAllRequests(@Query('currentVersion') currentVersion: string) {
    return this.client.send('app.check.version', currentVersion).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
