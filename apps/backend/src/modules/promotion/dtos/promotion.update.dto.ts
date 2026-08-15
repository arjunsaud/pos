import { PartialType } from '@nestjs/swagger';
import { PromotionCreateDto } from './promotion.create.dto';

export class PromotionUpdateDto extends PartialType(PromotionCreateDto) {}
