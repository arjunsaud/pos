import { OmitType } from '@nestjs/swagger';
import { ReferralGetSerialization } from './referral.get.serialization';

export class ReferralListSerialization extends OmitType(
  ReferralGetSerialization,
  [] as const,
) {}
