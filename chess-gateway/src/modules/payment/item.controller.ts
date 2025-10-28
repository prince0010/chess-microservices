import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from 'src/config';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('item')
export class ItemController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(SuperAdminGuard)
  @Post('/seed-list-packages')
  seedListItems() {
    return this.client.send('item.seed.list', {}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/')
  findAll(@Req() req: any) {
    return this.client.send('item.find.all', +req.user.uid).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  // @UseGuards(AuthGuard)
  // @Get('/:id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.client.send('item.find.one', id).pipe(
  //     catchError((err) => {
  //       throw new RpcException(err);
  //     }),
  //   );
  // }
}
