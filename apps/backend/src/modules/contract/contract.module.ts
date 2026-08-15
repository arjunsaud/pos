import { Module } from '@nestjs/common';
import { ContractRepositoryModule } from './repository/contract.repository.module';
import { ContractService } from './services/contract.service';

@Module({
  imports: [ContractRepositoryModule],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
