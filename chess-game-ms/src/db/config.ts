import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from 'src/config';

export class ConfigDB {
  static getTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: 'game-mariadb', // Put here the mysql alias container when using Docker
      port: +envs.dbGamePort,
      database: envs.dbGameName,
      username: envs.dbGameUsername,
      password: envs.dbGamePassword,
      entities: ['dist/**/*.entity{ .ts,.js}'],
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      autoLoadEntities: false,
      synchronize: false,
    };
  }
}
