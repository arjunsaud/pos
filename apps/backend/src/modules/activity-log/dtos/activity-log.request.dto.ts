import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ActivityLogRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  activityLog: string;
}
