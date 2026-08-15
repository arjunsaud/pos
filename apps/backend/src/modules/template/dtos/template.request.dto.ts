import { IsMongoId, IsNotEmpty } from 'class-validator';

export class TemplateRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  template: string;
}
