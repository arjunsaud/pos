import { Module } from '@nestjs/common';
import { ProductRepositoryModule } from '../product/repository/product.repository.module';
import { PurchaseRepositoryModule } from '../purchase/repository/purchase.repository.module';
import { SaleRepositoryModule } from '../sale/repository/sale.repository.module';
import { ReportService } from './services/report.service';

@Module({
  imports: [
    SaleRepositoryModule,
    ProductRepositoryModule,
    PurchaseRepositoryModule,
  ],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
