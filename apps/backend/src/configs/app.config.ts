import { registerAs } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'POS Nepal',
    env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.DEVELOPMENT,
    notifyEmail: process.env.NOTIFY_EMAIL,
    repoVersion: 1,
    versioning: {
      enable: process.env.HTTP_VERSIONING_ENABLE === 'true' ? true : false,
      prefix: 'v',
      version: process.env.HTTP_VERSION ?? '1',
    },

    globalPrefix: '/api',
    http: {
      enable: process.env.HTTP_ENABLE === 'true' ? true : false,
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 3000,
    },

    jobEnable: process.env.JOB_ENABLE === 'true' ? true : false,

    frontUrl: process.env.AUTH_JWT_AUDIENCE,
  }),
);
