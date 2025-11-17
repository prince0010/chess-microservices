import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { AppVersionModule } from './modules/app-version/app-version.module';
import { PandaModule } from './modules/panda/panda.module';
import { SharedModule } from './modules/shared/shared.module';
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
    SharedModule,
    AppVersionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
