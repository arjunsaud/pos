import { OmitType } from '@nestjs/swagger';
import { FeatureGetSerialization } from './feature.get.serialization';

export class FeatureListSerialization extends OmitType(
  FeatureGetSerialization,
  [] as const,
) {}
