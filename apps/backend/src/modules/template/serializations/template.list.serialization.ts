import { OmitType } from '@nestjs/swagger';
import { TemplateGetSerialization } from './template.get.serialization';

export class TemplateListSerialization extends OmitType(
  TemplateGetSerialization,
  [] as const,
) {}
