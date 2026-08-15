import { PartialType } from '@nestjs/swagger';
import { SubscriptionCreateDto } from './subscription.create.dto';

export class SubscriptionUpdateDto extends PartialType(SubscriptionCreateDto) {}
