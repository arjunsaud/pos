import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DocumentRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  document: string;
}
