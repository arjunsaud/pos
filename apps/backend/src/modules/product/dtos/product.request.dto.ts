import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ProductRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  product: string;
}
