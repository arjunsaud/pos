import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { ProductRepositoryModule } from './repository/product.repository.module';
import { ProductService } from './services/product.service';

@Module({
  imports: [ProductRepositoryModule, CategoryModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
