import { OmitType } from '@nestjs/swagger';
import { StockTransferGetSerialization } from './stock-transfer.get.serialization';

export class StockTransferListSerialization extends OmitType(
  StockTransferGetSerialization,
  [] as const,
) {}
