import { PartialType } from '@nestjs/swagger';
import { PurchaseCreateDto } from './purchase.create.dto';

export class PurchaseUpdateDto extends PartialType(PurchaseCreateDto) {}
