import { OmitType } from '@nestjs/swagger';
import { SubscriptionGetSerialization } from './subscription.get.serialization';

export class SubscriptionListSerialization extends OmitType(
  SubscriptionGetSerialization,
  [] as const,
) {}
