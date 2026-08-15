import { IsMongoId, IsNotEmpty } from 'class-validator';

export class PromotionRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  promotion: string;
}
