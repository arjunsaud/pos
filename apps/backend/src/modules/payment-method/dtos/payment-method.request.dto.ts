import { IsMongoId, IsNotEmpty } from 'class-validator';

export class PaymentMethodRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  paymentMethod: string;
}
