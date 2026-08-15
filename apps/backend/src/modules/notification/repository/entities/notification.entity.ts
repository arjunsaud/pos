import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { INotificationEntity } from '../../interfaces/notification.entity.interface';

export const NotificationDataBaseName = 'notifications';

@DatabaseEntity({ collection: NotificationDataBaseName })
export class NotificationEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements INotificationEntity
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
  type: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  title: string;

  @Prop({
    required: true,
    index: false,
    type: String,
    default: '',
  })
  message: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'medium',
  })
  priority: string;

  @Prop({
    required: false,
    index: true,
    type: Boolean,
    default: false,
  })
  isRead?: boolean;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  actionUrl?: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  entityId?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationEntity);

export type NotificationDoc = NotificationEntity & Document;
