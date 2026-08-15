import { OmitType } from '@nestjs/swagger';
import { BannerGetSerialization } from './banner.get.serialization';

export class BannerListSerialization extends OmitType(
  BannerGetSerialization,
  [] as const,
) {}
