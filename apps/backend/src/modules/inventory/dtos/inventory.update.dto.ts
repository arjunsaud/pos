import { PartialType } from '@nestjs/swagger';
import { InventoryCreateDto } from './inventory.create.dto';

export class InventoryUpdateDto extends PartialType(InventoryCreateDto) {}
