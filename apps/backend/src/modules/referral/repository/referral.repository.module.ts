import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ReferralEntity, ReferralSchema } from './entities/referral.entity';
import { ReferralRepository } from './repositories/referral.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ReferralEntity.name,
          schema: ReferralSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [ReferralRepository],
  exports: [ReferralRepository],
})
export class ReferralRepositoryModule {}
