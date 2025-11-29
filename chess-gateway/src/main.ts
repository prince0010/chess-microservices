import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

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
        'https://we-chess.com',
        'https://www.we-chess.com',
        'https://api.we-chess.com', // If case we use API subdomain
      ],
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
      ],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 86400, // 24 hours - cache preflight requests
    });
  } else if (env === 'testing') {
    app.enableCors({
      origin: ['http://69.62.117.146:4000', 'http://69.62.117.146:3000'],
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      optionsSuccessStatus: 204,
    });
  } else {
    app.enableCors({
      origin: [
        'http://localhost:4200',
        'http://localhost:3000',
        'http://localhost:3001', // Common additional dev ports
        'http://127.0.0.1:4200',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ],
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      optionsSuccessStatus: 204,
    });
  }

  app.setGlobalPrefix('api', {
    exclude: ['/'], // Keeps website root without prefix
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
