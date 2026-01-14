import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');

export const RedisProvider = {
  provide: REDIS,
  useFactory: () => {
    return new Redis({
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT ?? 6379),
    });
  },
};
