import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CustomerRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  customer: string;
}
