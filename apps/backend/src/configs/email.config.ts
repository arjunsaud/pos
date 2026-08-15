import { registerAs } from '@nestjs/config';

export default registerAs(
  'email',
  (): Record<string, any> => ({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    email: process.env.EMAIL_EMAIL,
    pass: process.env.EMAIL_PASS,
  }),
);
