import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { CategoryDoc, CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  CategoryEntity,
  CategoryDoc
> {
  constructor(
    @DatabaseModel(CategoryEntity.name)
    private readonly _categoryModel: Model<CategoryEntity>,
  ) {
    super(_categoryModel);
  }
}
