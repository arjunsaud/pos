import { OmitType } from '@nestjs/swagger';
import { DocumentGetSerialization } from './document.get.serialization';

export class DocumentListSerialization extends OmitType(
  DocumentGetSerialization,
  [] as const,
) {}
