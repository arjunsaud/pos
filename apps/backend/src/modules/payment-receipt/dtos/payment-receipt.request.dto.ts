import { IsMongoId, IsNotEmpty } from 'class-validator';

export class PaymentReceiptRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  paymentReceipt: string;
}
