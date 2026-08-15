import { OmitType } from '@nestjs/swagger';
import { DashboardGetSerialization } from './dashboard.get.serialization';

export class DashboardListSerialization extends OmitType(
  DashboardGetSerialization,
  [] as const,
) {}
