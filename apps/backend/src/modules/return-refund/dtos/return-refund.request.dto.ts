import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ReturnRefundRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  returnRefund: string;
}
