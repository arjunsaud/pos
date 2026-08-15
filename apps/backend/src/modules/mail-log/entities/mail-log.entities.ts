import { Prop, raw, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const MailLogDatabaseName = 'mail_logs';
export enum MAIL_LOG_ENUM {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@DatabaseEntity({ collection: MailLogDatabaseName })
export class MailLogEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({ type: String })
  to: string;

  @Prop({ type: String })
  subject: string;

  @Prop({ type: String })
  text: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: raw({}) })
  error: Record<string, any>;
}

export const MailLogSchema = SchemaFactory.createForClass(MailLogEntity);

export type MailLogDoc = MailLogEntity & Document;
