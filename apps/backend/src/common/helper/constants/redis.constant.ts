import { config } from 'dotenv';

config();

export const isRedisEnabled = (): boolean =>
  process.env.REDIS_ENABLE === 'true';
