import { PartialType } from '@nestjs/swagger';
import { SupportTicketCreateDto } from './support-ticket.create.dto';

export class SupportTicketUpdateDto extends PartialType(SupportTicketCreateDto) {}
