import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SubscriptionRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  subscription: string;
}
