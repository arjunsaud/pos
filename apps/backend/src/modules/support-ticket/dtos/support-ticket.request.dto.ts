import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SupportTicketRequestDto {
  @IsNotEmpty()
  @IsMongoId()
  supportTicket: string;
}
