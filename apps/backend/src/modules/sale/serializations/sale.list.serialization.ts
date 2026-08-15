import { OmitType } from '@nestjs/swagger';
import { SaleGetSerialization } from './sale.get.serialization';

export class SaleListSerialization extends OmitType(
  SaleGetSerialization,
  [] as const,
) {}
