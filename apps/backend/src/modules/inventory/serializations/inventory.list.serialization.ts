import { OmitType } from '@nestjs/swagger';
import { InventoryGetSerialization } from './inventory.get.serialization';

export class InventoryListSerialization extends OmitType(
  InventoryGetSerialization,
  [] as const,
) {}
