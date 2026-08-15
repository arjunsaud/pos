import { IsMongoId, IsNotEmpty } from 'class-validator';

export class InventoryRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  inventory: string;
}
