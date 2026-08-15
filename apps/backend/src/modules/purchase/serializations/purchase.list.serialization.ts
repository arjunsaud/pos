import { OmitType } from '@nestjs/swagger';
import { PurchaseGetSerialization } from './purchase.get.serialization';

export class PurchaseListSerialization extends OmitType(
  PurchaseGetSerialization,
  [] as const,
) {}
