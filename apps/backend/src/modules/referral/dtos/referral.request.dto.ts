import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ReferralRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  referral: string;
}
