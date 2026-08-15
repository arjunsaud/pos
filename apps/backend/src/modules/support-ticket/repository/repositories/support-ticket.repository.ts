import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { SupportTicketDoc, SupportTicketEntity } from '../entities/support-ticket.entity';

@Injectable()
export class SupportTicketRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  SupportTicketEntity,
  SupportTicketDoc
> {
  constructor(
    @DatabaseModel(SupportTicketEntity.name)
    private readonly _supportTicketModel: Model<SupportTicketEntity>,
  ) {
    super(_supportTicketModel);
  }
}
