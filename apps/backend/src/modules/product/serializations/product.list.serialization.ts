import { OmitType } from '@nestjs/swagger';
import { ProductGetSerialization } from './product.get.serialization';

export class ProductListSerialization extends OmitType(
  ProductGetSerialization,
  [] as const,
) {}
