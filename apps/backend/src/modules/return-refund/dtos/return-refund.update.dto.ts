import { PartialType } from '@nestjs/swagger';
import { ReturnRefundCreateDto } from './return-refund.create.dto';

export class ReturnRefundUpdateDto extends PartialType(ReturnRefundCreateDto) {}
