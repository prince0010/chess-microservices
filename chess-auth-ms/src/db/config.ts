import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from 'src/config';

export class ConfigDB {
  static getTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: envs.dbAuthHost, // Put here the mysql alias container when using Docker
      port: +envs.dbAuthPort,
      database: envs.dbAuthName,
      username: envs.dbAuthUsername,
      password: envs.dbAuthPassword,
      entities: ['dist/**/*.entity{ .ts,.js}'],
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      autoLoadEntities: false,
      synchronize: false,
    };
  }
}
