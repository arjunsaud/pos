import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AdminRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  admin: string;
}
