import { OmitType } from '@nestjs/swagger';
import { VendorGetSerialization } from './vendor.get.serialization';

export class VendorListSerialization extends OmitType(
  VendorGetSerialization,
  [] as const,
) {}
