import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigDB } from './db/config';

import { TetrisModule } from './modules/tetris/tetris.module';
import { GuessPositionModule } from './modules/guess-position/guess-position.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // to make ConfigModule available globally
      envFilePath: '.env',
    }),

    // TypeOrmConfig
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return ConfigDB.getTypeOrmOptions();
      },
      // This imports allow the typeOrm connect with Mysql and use .env without errors
      imports: [ConfigModule],
      inject: [ConfigService],
    }),

    TetrisModule,
    GuessPositionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
