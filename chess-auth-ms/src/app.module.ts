import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { PandaModule } from './panda/panda.module';
import { ConfigDB } from './db/config';

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
    AuthModule,
    PandaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
