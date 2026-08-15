import { PartialType } from '@nestjs/swagger';
import { StockMovementCreateDto } from './stock-movement.create.dto';

export class StockMovementUpdateDto extends PartialType(StockMovementCreateDto) {}
