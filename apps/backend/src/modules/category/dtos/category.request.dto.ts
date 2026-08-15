import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CategoryRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  category: string;
}
