import { PartialType } from '@nestjs/swagger';
import { FeatureCreateDto } from './feature.create.dto';

export class FeatureUpdateDto extends PartialType(FeatureCreateDto) {}
