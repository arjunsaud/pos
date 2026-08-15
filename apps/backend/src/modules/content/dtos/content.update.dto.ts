import { PartialType } from '@nestjs/swagger';
import { ContentCreateDto } from './content.create.dto';

export class ContentUpdateDto extends PartialType(ContentCreateDto) {}
