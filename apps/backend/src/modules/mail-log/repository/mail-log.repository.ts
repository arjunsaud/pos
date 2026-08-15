import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { MailLogDoc, MailLogEntity } from '../entities/mail-log.entities';

@Injectable()
export class MailLogRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  MailLogEntity,
  MailLogDoc
> {
  constructor(
    @DatabaseModel(MailLogEntity.name)
    private readonly mailLogModel: Model<MailLogEntity>,
  ) {
    super(mailLogModel);
  }
}
