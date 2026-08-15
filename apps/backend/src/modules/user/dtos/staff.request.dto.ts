import { IsMongoId, IsNotEmpty } from 'class-validator';

export class StaffRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  staff: string;
}
