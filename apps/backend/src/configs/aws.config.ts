import { registerAs } from '@nestjs/config';

export default registerAs(
  'aws',
  (): Record<string, any> => ({
    key: process.env.R2_CREDENTIAL_KEY,
    secret: process.env.R2_CREDENTIAL_SECRET,
    bucket: process.env.R2_BUCKET,
    baseUrl: process.env.R2_BASE_URL,
  }),
);
