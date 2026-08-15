import { IsMongoId, IsNotEmpty } from 'class-validator';

export class StockMovementRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  stockMovement: string;
}
