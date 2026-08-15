import { PartialType } from '@nestjs/swagger';
import { DocumentCreateDto } from './document.create.dto';

export class DocumentUpdateDto extends PartialType(DocumentCreateDto) {}
