import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { SupportTicketEntity, SupportTicketSchema } from './entities/support-ticket.entity';
import { SupportTicketRepository } from './repositories/support-ticket.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SupportTicketEntity.name,
          schema: SupportTicketSchema,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [SupportTicketRepository],
  exports: [SupportTicketRepository],
})
export class SupportTicketRepositoryModule {}
