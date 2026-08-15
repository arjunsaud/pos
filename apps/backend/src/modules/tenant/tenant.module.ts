import { Module } from '@nestjs/common';
import { TenantRepositoryModule } from './repository/tenant.repository.module';
import { TenantService } from './services/tenant.service';

@Module({
  imports: [TenantRepositoryModule],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
