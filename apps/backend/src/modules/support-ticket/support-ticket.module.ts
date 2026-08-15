import { Module } from '@nestjs/common';
import { SupportTicketRepositoryModule } from './repository/support-ticket.repository.module';
import { SupportTicketService } from './services/support-ticket.service';

@Module({
  imports: [SupportTicketRepositoryModule],
  providers: [SupportTicketService],
  exports: [SupportTicketService],
})
export class SupportTicketModule {}
