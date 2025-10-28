import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigDB } from './db/config';
import { PaymentModule } from './modules/payment/payment.module';
import { OrderModule } from './modules/order/order.module';
import { ItemModule } from './modules/item/item.module';

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

    PaymentModule,
    OrderModule,
    ItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
