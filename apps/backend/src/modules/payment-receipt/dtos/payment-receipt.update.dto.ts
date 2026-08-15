import { PartialType } from '@nestjs/swagger';
import { PaymentReceiptCreateDto } from './payment-receipt.create.dto';

export class PaymentReceiptUpdateDto extends PartialType(PaymentReceiptCreateDto) {}
