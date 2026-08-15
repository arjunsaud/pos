import { OmitType } from '@nestjs/swagger';
import { PromotionGetSerialization } from './promotion.get.serialization';

export class PromotionListSerialization extends OmitType(
  PromotionGetSerialization,
  [] as const,
) {}
