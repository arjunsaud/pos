import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationRepository } from './verification.repository';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { OTPEntity, OTPSchema } from '../entities/otp.entity';

@Module({
  providers: [VerificationRepository],
  exports: [VerificationRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: OTPEntity.name,
          schema: OTPSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class VerificationRepositoryModule {}
