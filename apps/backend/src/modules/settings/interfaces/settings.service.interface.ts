import {
  IDatabaseCreateOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import { SettingsDoc } from '../repository/entities/settings.entity';

export interface ISettingsService {
  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<SettingsDoc>;

  create(
    data: UpdateSettingsDto,
    options?: IDatabaseCreateOptions,
  ): Promise<SettingsDoc>;
  update(
    repository: SettingsDoc,
    data: UpdateSettingsDto,
    options?: IDatabaseSaveOptions,
  ): Promise<SettingsDoc>;
}
