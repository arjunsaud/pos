import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ContentRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  content: string;
}
