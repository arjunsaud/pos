import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AuthModule } from 'src/common/auth/auth.module';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { DatabaseOptionsModule } from 'src/common/database/database.options.module';
import { DatabaseOptionsService } from 'src/common/database/services/database.options.service';
import { ErrorModule } from 'src/common/error/error.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { MessageModule } from 'src/common/message/message.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { RequestModule } from 'src/common/request/request.module';
import { ResponseModule } from 'src/common/response/response.module';
import configs from 'src/configs';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { CronModule } from './cron/cron.module';
import { DebuggerModule } from './debugger/debugger.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_ENV: Joi.string()
          .valid(...Object.values(ENUM_APP_ENVIRONMENT))
          .required(),
        APP_LANGUAGE: Joi.string().optional(),

        HTTP_ENABLE: Joi.boolean().default(true).required(),
        HTTP_HOST: [Joi.string().required()],
        HTTP_PORT: Joi.number().default(3000).required(),
        HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
        HTTP_VERSION: Joi.number().required(),

        DEBUGGER_WRITE_INTO_FILE: Joi.boolean().default(false).required(),
        JOB_ENABLE: Joi.boolean().default(false).required(),

        DATABASE_HOST: Joi.string().required(),
        DATABASE_NAME: Joi.string().default('posnepal').required(),
        DATABASE_DEBUG: Joi.boolean().default(false).required(),
        DATABASE_OPTIONS: Joi.string().allow('').optional(),

        AUTH_JWT_SUBJECT: Joi.string().required(),
        AUTH_JWT_AUDIENCE: Joi.string().required(),
        AUTH_JWT_ISSUER: Joi.string().required(),

        AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().required(),
        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().alphanum().required(),
        AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().required(),
        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().alphanum().required(),

        AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean().default(false).required(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string()
          .allow(null, '')
          .optional(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string()
          .allow(null, '')
          .optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string()
          .allow(null, '')
          .optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string()
          .allow(null, '')
          .optional(),

        REDIS_ENABLE: Joi.boolean().default(false).optional(),
        REDIS_PASS: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),

        NOTIFY_EMAIL: Joi.string().required(),

        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.string().required(),
        EMAIL_EMAIL: Joi.string().required(),
        EMAIL_PASS: Joi.string().required(),

        // PAYPAL_CLIENT_SECRET_KEY: Joi.string().required(),
        // PAYPAL_CLIENT_SECRET_ID: Joi.string().required(),
        // PAYPAL_URL: Joi.string().required(),

        CYBERSOURCE_API_URL: Joi.string().optional().allow(''),
        CYBERSOURCE_MERCHANT_ID: Joi.string().optional().allow(''),
        CYBERSOURCE_KEY_ID: Joi.string().optional().allow(''),
        CYBERSOURCE_SECRET_KEY: Joi.string().optional().allow(''),
        CYBERSOURCE_SIGNATURE: Joi.string().optional().allow(''),
        CYBERSOURCE_ENV: Joi.string().optional().allow(''),

        R2_CREDENTIAL_KEY: Joi.string().required(),
        R2_CREDENTIAL_SECRET: Joi.string().required(),
        R2_BUCKET: Joi.string().required(),
        R2_BASE_URL: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      imports: [DatabaseOptionsModule],
      inject: [DatabaseOptionsService],
      useFactory: (databaseOptionsService: DatabaseOptionsService) => {
        return databaseOptionsService.createOptions();
      },
    }),
    CronModule,
    DebuggerModule,
    MessageModule,
    HelperModule,
    PaginationModule,
    ErrorModule,
    ResponseModule,
    RequestModule,
    AuthModule.forRoot(),
  ],
})
export class CommonModule {}
