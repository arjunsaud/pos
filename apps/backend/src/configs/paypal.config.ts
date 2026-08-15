import { registerAs } from '@nestjs/config';

export default registerAs(
  'paypal',
  (): Record<string, any> => ({
    clientSecret: process.env.PAYPAL_CLIENT_SECRET_KEY ?? '',
    clientId: process.env.PAYPAL_CLIENT_SECRET_ID ?? '',
    url: process.env.PAYPAL_URL ?? '',
  }),
);
