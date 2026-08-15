import { OmitType } from '@nestjs/swagger';
import { ContentGetSerialization } from './content.get.serialization';

export class ContentListSerialization extends OmitType(
  ContentGetSerialization,
  [] as const,
) {}
