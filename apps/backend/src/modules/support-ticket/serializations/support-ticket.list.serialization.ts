import { OmitType } from '@nestjs/swagger';
import { SupportTicketGetSerialization } from './support-ticket.get.serialization';

export class SupportTicketListSerialization extends OmitType(
  SupportTicketGetSerialization,
  [] as const,
) {}
