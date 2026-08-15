import { Module } from '@nestjs/common';
import { ProductRepositoryModule } from './repository/product.repository.module';
import { ProductService } from './services/product.service';

@Module({
  imports: [ProductRepositoryModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
