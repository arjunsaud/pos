import { OmitType } from '@nestjs/swagger';
import { StockMovementGetSerialization } from './stock-movement.get.serialization';

export class StockMovementListSerialization extends OmitType(
  StockMovementGetSerialization,
  [] as const,
) {}
