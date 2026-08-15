import { PartialType } from '@nestjs/swagger';
import { StockTransferCreateDto } from './stock-transfer.create.dto';

export class StockTransferUpdateDto extends PartialType(StockTransferCreateDto) {}
