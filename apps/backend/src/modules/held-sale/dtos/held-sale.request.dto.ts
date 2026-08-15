import { IsMongoId, IsNotEmpty } from 'class-validator';

export class HeldSaleRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  heldSale: string;
}
