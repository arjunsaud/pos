import { IsMongoId, IsNotEmpty } from 'class-validator';

export class MailLogRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  mail: string;
}
