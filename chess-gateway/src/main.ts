import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { RpcCustomExceptionFilter } from './common';
import { configureCors, envs } from './config';

async function bootstrap() {
  const logger = new Logger('Chess-Gateway');

  const app = await NestFactory.create(AppModule);

  const env = process.env.NODE_ENV || 'development';

  // CORS
  configureCors(app, env);

  app.setGlobalPrefix('api', {
    exclude: ['/', '/admin/*'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // transform: true, // Enable auto-transformation
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
    }),
  );

  app.use(compression());

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(`Chess-Gateway running on port ${envs.port}`);
}
bootstrap();
