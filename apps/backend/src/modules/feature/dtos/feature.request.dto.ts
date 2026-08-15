import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FeatureRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  feature: string;
}
