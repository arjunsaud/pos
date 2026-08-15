import { IsMongoId, IsNotEmpty } from 'class-validator';

export class VendorRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  vendor: string;
}
