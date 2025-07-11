import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { RpcCustomExceptionFilter } from './common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Chess-Gateway');

  const app = await NestFactory.create(AppModule);

  const env = process.env.NODE_ENV;

  if (env === 'production') {
    app.enableCors({
      origin: [
        'https://your-production-domain.com',
        'http://localhost:4200', // TODO: remove me when domain name is ready and production is ready
        'https://we-chess-testing.netlify.app', // TODO: remove me when domain name is ready and production is ready
      ],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      optionsSuccessStatus: 204,
    });
  } else {
    // development
    app.enableCors({
      origin: ['http://localhost:4200', 'https://we-chess-testing.netlify.app'],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      optionsSuccessStatus: 204,
    });
  }

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

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(`Chess-Gateway running on port ${envs.port}`);
}
bootstrap();
