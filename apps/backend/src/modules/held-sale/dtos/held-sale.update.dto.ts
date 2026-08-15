import { PartialType } from '@nestjs/swagger';
import { HeldSaleCreateDto } from './held-sale.create.dto';

export class HeldSaleUpdateDto extends PartialType(HeldSaleCreateDto) {}
