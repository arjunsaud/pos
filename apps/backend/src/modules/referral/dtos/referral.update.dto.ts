import { PartialType } from '@nestjs/swagger';
import { ReferralCreateDto } from './referral.create.dto';

export class ReferralUpdateDto extends PartialType(ReferralCreateDto) {}
