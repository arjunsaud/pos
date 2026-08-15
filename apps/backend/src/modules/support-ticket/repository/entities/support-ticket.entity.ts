import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ISupportTicketEntity } from '../../interfaces/support-ticket.entity.interface';

export const SupportTicketDataBaseName = 'support_tickets';

@DatabaseEntity({ collection: SupportTicketDataBaseName })
export class SupportTicketEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements ISupportTicketEntity
{
  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  tenantId: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  tenantName: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  subject: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  description: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  category: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'medium',
  })
  priority: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'open',
  })
  status: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  respondedAt?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  response?: string;

  @Prop({
    required: false,
    index: false,
    type: Array,
    default: [],
  })
  attachments?: string[];
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicketEntity);

export type SupportTicketDoc = SupportTicketEntity & Document;
