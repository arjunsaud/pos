import { OmitType } from '@nestjs/swagger';
import { NotificationGetSerialization } from './notification.get.serialization';

export class NotificationListSerialization extends OmitType(
  NotificationGetSerialization,
  [] as const,
) {}
