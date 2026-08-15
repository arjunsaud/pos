import { PartialType } from '@nestjs/swagger';
import { PaymentMethodCreateDto } from './payment-method.create.dto';

export class PaymentMethodUpdateDto extends PartialType(PaymentMethodCreateDto) {}
