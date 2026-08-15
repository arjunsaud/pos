import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SaleRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  sale: string;
}
