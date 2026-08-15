import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { CustomerEntity, CustomerSchema } from './entities/customer.entity';
import { CustomerRepository } from './repositories/customer.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CustomerEntity.name,
          schema: CustomerSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [CustomerRepository],
  exports: [CustomerRepository],
})
export class CustomerRepositoryModule {}
