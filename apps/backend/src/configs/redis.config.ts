import { registerAs } from '@nestjs/config';

function parseRedisUrl(raw?: string): {
  host: string;
  port?: number;
  tls?: Record<string, unknown>;
} {
  const value = raw || '127.0.0.1';
  if (!value.includes('://')) {
    const remote = value !== '127.0.0.1' && value !== 'localhost';
    return {
      host: value,
      tls: remote ? {} : undefined,
    };
  }

  const url = new URL(value);
  const remote =
    url.hostname !== '127.0.0.1' && url.hostname !== 'localhost';
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : undefined,
    tls: url.protocol === 'rediss:' || remote ? {} : undefined,
  };
}

export default registerAs('redis', (): Record<string, any> => {
  const parsed = parseRedisUrl(process.env.REDIS_URL);
  return {
    host: parsed.host,
    port: parsed.port ?? Number(process.env.REDIS_PORT ?? 6379),
    pass: process.env.REDIS_PASS,
    tls: parsed.tls,
  };
});
