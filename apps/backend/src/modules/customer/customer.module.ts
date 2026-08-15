import { Module } from '@nestjs/common';
import { CustomerRepositoryModule } from './repository/customer.repository.module';
import { CustomerService } from './services/customer.service';

@Module({
  imports: [CustomerRepositoryModule],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
