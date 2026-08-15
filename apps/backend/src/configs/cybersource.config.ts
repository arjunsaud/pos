import { registerAs } from '@nestjs/config';

export default registerAs(
  'cybersource',
  (): Record<string, any> => ({
    merchantId: process.env.CYBERSOURCE_MERCHANT_ID,
    keyId: process.env.CYBERSOURCE_KEY_ID,
    secretKey: process.env.CYBERSOURCE_SECRET_KEY,
    runEnv: process.env.CYBERSOURCE_ENV,
    signature: process.env.CYBERSOURCE_SIGNATURE,
  }),
);
