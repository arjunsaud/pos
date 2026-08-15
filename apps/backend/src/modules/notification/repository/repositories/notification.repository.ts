import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { NotificationDoc, NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  NotificationEntity,
  NotificationDoc
> {
  constructor(
    @DatabaseModel(NotificationEntity.name)
    private readonly _notificationModel: Model<NotificationEntity>,
  ) {
    super(_notificationModel);
  }
}
