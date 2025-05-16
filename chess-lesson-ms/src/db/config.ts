import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { envs } from 'src/config';

export class ConfigDB {
  static getTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: envs.dbLessonHost, // Put here the mysql alias container when using Docker
      port: +envs.dbLessonPort,
      database: envs.dbLessonName,
      username: envs.dbLessonUsername,
      password: envs.dbLessonPassword,
      entities: ['dist/**/*.entity{ .ts,.js}'],
      migrations: ['dist/db/migrations/*{.ts,.js}'],
      autoLoadEntities: false,
      synchronize: false,
    };
  }
}
