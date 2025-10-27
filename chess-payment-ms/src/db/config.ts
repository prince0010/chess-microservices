import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from 'src/config';

export class ConfigDB {
  static getTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: envs.dbPaymentHost, // Put here the mysql alias container when using Docker
      port: +envs.dbPaymentPort,
      database: envs.dbPaymentName,
      username: envs.dbPaymentUsername,
      password: envs.dbPaymentPassword,
      entities: ['dist/**/*.entity{ .ts,.js}'],
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      autoLoadEntities: false,
      synchronize: false,
    };
  }
}
