import { IsMongoId, IsNotEmpty } from 'class-validator';

export class NotificationRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  notification: string;
}
