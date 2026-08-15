import { OmitType } from '@nestjs/swagger';
import { PackageGetSerialization } from './package.get.serialization';

export class PackageListSerialization extends OmitType(
  PackageGetSerialization,
  [] as const,
) {}
