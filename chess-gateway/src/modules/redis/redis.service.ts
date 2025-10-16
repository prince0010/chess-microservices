import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis.Redis;

  onModuleInit() {
    this.client = new Redis.Redis({
      host: 'redis', // Redis server host
      port: 6379, // Redis server port
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async set(key: string, otp: any, ttlInSeconds: number): Promise<void> {
    const payload = JSON.stringify(otp);
    await this.client.set(key, payload, 'EX', ttlInSeconds); // 'EX' sets an expiration time
  }

  async get(key: string): Promise<any | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // deleting OTP (optional)
  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }
}
