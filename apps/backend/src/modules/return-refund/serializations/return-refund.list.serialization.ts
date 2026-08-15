import { OmitType } from '@nestjs/swagger';
import { ReturnRefundGetSerialization } from './return-refund.get.serialization';

export class ReturnRefundListSerialization extends OmitType(
  ReturnRefundGetSerialization,
  [] as const,
) {}
