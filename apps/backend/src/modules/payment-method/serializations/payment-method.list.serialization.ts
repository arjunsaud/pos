import { OmitType } from '@nestjs/swagger';
import { PaymentMethodGetSerialization } from './payment-method.get.serialization';

export class PaymentMethodListSerialization extends OmitType(
  PaymentMethodGetSerialization,
  [] as const,
) {}
