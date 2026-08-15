import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { ProductEntity, ProductSchema } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ProductEntity.name,
          schema: ProductSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [ProductRepository],
  exports: [ProductRepository],
})
export class ProductRepositoryModule {}
