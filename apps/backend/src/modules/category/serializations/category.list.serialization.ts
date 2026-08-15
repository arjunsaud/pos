import { OmitType } from '@nestjs/swagger';
import { CategoryGetSerialization } from './category.get.serialization';

export class CategoryListSerialization extends OmitType(
  CategoryGetSerialization,
  [] as const,
) {}
