import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IActivityLogEntity } from '../../interfaces/activity-log.entity.interface';

export const ActivityLogDataBaseName = 'activity_logs';

@DatabaseEntity({ collection: ActivityLogDataBaseName })
export class ActivityLogEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IActivityLogEntity
{
  @Prop({
    required: false,
    index: true,
    type: String,
    default: '',
  })
  tenantId?: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  user: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: '',
  })
  action: string;

  @Prop({
    required: false,
    index: false,
    type: String,
    default: '',
  })
  details?: string;

  @Prop({
    required: true,
    index: true,
    type: String,
    default: 'info',
  })
  type: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLogEntity);

export type ActivityLogDoc = ActivityLogEntity & Document;
