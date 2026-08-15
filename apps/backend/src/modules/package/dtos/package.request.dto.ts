import { IsMongoId, IsNotEmpty } from 'class-validator';

export class PackageRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  package: string;
}
