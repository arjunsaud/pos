import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ContractRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  contract: string;
}
