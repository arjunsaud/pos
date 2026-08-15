import { OmitType } from '@nestjs/swagger';
import { OutletGetSerialization } from './outlet.get.serialization';

export class OutletListSerialization extends OmitType(
  OutletGetSerialization,
  [] as const,
) {}
