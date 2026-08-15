import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ContractEntity, ContractSchema } from './entities/contract.entity';
import { ContractRepository } from './repositories/contract.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ContractEntity.name,
          schema: ContractSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [ContractRepository],
  exports: [ContractRepository],
})
export class ContractRepositoryModule {}
