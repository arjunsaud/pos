import { IsMongoId, IsNotEmpty } from 'class-validator';

export class PurchaseRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  purchase: string;
}
