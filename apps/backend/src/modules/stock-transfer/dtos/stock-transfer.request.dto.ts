import { IsMongoId, IsNotEmpty } from 'class-validator';

export class StockTransferRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  stockTransfer: string;
}
