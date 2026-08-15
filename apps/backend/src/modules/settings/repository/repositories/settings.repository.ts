import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseMongoObjectIdRepositoryAbstract } from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { SettingsEntity, SettingsDoc } from '../entities/settings.entity';

@Injectable()
export class SettingsRepository extends DatabaseMongoObjectIdRepositoryAbstract<
  SettingsEntity,
  SettingsDoc
> {
  constructor(
    @DatabaseModel(SettingsEntity.name)
    private readonly settingsModel: Model<SettingsEntity>,
  ) {
    super(settingsModel);
  }
}
