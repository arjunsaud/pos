import { OmitType } from '@nestjs/swagger';
import { PaymentReceiptGetSerialization } from './payment-receipt.get.serialization';

export class PaymentReceiptListSerialization extends OmitType(
  PaymentReceiptGetSerialization,
  [] as const,
) {}
