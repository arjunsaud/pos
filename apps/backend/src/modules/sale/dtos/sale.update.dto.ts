import { PartialType } from '@nestjs/swagger';
import { SaleCreateDto } from './sale.create.dto';

export class SaleUpdateDto extends PartialType(SaleCreateDto) {}
