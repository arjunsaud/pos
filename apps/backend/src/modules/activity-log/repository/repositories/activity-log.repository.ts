import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { ActivityLogDoc, ActivityLogEntity } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  ActivityLogEntity,
  ActivityLogDoc
> {
  constructor(
    @DatabaseModel(ActivityLogEntity.name)
    private readonly _activityLogModel: Model<ActivityLogEntity>,
  ) {
    super(_activityLogModel);
  }
}
