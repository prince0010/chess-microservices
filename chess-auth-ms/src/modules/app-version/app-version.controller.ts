import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppVersionService } from './app-version.service';

@Controller()
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @MessagePattern('app.check.version')
  create(@Payload() currentVersion: string) {
    console.log(currentVersion);
    return this.appVersionService.checkVersion(currentVersion);
  }
}
