import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthCheck() {
    return 'Chess Client gateway is up and running !!';
  }
}
