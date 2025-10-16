import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { RpcCustomExceptionFilter } from './common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Chess-Gateway');

  const app = await NestFactory.create(AppModule);

  const env = process.env.NODE_ENV;

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  });

  // uncomment and adjust when deploy to production
  // if (env === 'production') {
  //   app.enableCors({
  //     origin: [
  //       'https://your-production-domain.com',
  //       'http://localhost:4200', // TODO: remove me when domain name and production is ready
  //       'https://test-we-chess.netlify.app', // TODO: remove me when domain name and production is ready
  //     ],
  //     credentials: true,
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //     optionsSuccessStatus: 204,
  //   });
  // } else {
  //   app.enableCors({
  //     origin: [
  //       'http://localhost:4200',
  //       'http://localhost:3000',
  //       'https://test-we-chess.netlify.app',
  //     ],
  //     credentials: true,
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //     optionsSuccessStatus: 204,
  //   });
  // }

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(compression());

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(`Chess-Gateway running on port ${envs.port}`);
}
bootstrap();
