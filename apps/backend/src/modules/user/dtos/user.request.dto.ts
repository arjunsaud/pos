import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;
}
