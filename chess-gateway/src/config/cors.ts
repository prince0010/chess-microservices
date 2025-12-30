import { INestApplication } from '@nestjs/common';

export const configureCors = (
  app: INestApplication<any>,
  env: string,
): void => {
  if (env === 'production') {
    app.enableCors({
      origin: [
        'https://we-chess.com',
        'https://www.we-chess.com',
        // 'https://api.we-chess.com', // In case we use API subdomain
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
      origin: [
        'https://test-we-chess.com',
        'https://www.test-we-chess.com',
        'http://69.62.117.146:4000',
        'http://69.62.117.146:3000',
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
  } else {
    app.enableCors({
      origin: [
        'http://localhost:4200',
        'http://localhost:3000',
        'http://localhost:3001',
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
};
