import { IsMongoId, IsNotEmpty } from 'class-validator';

export class TenantRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  tenant: string;
}
