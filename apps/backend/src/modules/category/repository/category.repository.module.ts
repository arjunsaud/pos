import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { CategoryEntity, CategorySchema } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CategoryEntity.name,
          schema: CategorySchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryRepositoryModule {}
