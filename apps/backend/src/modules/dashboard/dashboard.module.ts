import { Module } from '@nestjs/common';
import { ActivityLogRepositoryModule } from '../activity-log/repository/activity-log.repository.module';
import { InventoryRepositoryModule } from '../inventory/repository/inventory.repository.module';
import { ProductRepositoryModule } from '../product/repository/product.repository.module';
import { SaleRepositoryModule } from '../sale/repository/sale.repository.module';
import { SubscriptionRepositoryModule } from '../subscription/repository/subscription.repository.module';
import { TenantRepositoryModule } from '../tenant/repository/tenant.repository.module';
import { UserRepositoryModule } from '../user/repository/user.repository.module';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [
    TenantRepositoryModule,
    SubscriptionRepositoryModule,
    SaleRepositoryModule,
    ProductRepositoryModule,
    InventoryRepositoryModule,
    ActivityLogRepositoryModule,
    UserRepositoryModule,
  ],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
