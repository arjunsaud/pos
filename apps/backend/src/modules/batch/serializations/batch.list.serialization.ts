import { OmitType } from '@nestjs/swagger';
import { BatchGetSerialization } from './batch.get.serialization';

export class BatchListSerialization extends OmitType(
  BatchGetSerialization,
  [] as const,
) {}
