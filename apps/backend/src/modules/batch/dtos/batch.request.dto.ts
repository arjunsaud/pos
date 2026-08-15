import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BatchRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  batch: string;
}
