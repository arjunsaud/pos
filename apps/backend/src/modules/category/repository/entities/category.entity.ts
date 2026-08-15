import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ICategoryEntity } from '../../interfaces/category.entity.interface';

export const CategoryDataBaseName = 'categories';

@DatabaseEntity({ collection: CategoryDataBaseName })
export class CategoryEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements ICategoryEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  tenantId: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  description?: string;

  @Prop({
    required: false,
    index: false,
    type: Number,
    default: 0,
  })
  productCount?: number;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);

export type CategoryDoc = CategoryEntity & Document;
