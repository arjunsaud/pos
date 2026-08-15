import { IsMongoId, IsNotEmpty } from 'class-validator';

export class OutletRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  outlet: string;
}
