import { OmitType } from '@nestjs/swagger';
import { ActivityLogGetSerialization } from './activity-log.get.serialization';

export class ActivityLogListSerialization extends OmitType(
  ActivityLogGetSerialization,
  [] as const,
) {}
