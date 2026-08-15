import { OmitType } from '@nestjs/swagger';
import { HeldSaleGetSerialization } from './held-sale.get.serialization';

export class HeldSaleListSerialization extends OmitType(
  HeldSaleGetSerialization,
  [] as const,
) {}
