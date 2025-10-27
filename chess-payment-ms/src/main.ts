import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';

import { AppModule } from './app.module';

import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Payment-MS');

  // This make this MS a Rest(traditional)
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}))
          .flat();

        return new RpcException({
          status: 400,
          message: messages.length ? messages : ['Validation failed'],
        });
      },
    }),
  );

  // Question: Why this microservice use NestFactory.create and also app.connectMicroservice
  // Response: because this microservice is not equal to others. This MS is hybrid between Nats and Rest(traditional), both working in this MS.

  // This make this MS connect with NATS
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers, // with NATS_SERVERS in the env file
      },
    },
    { inheritAppConfig: true }, // important to allow global pipes and global config passed in hybrid servers
  );

  await app.startAllMicroservices(); // this allow to connect with NATS server
  await app.listen(envs.port);

  logger.log(`Chess Payment Microservice running on port ${envs.port}`);
}
bootstrap();
