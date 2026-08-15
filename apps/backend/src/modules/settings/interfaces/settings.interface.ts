import {
  SettingsDoc,
  SettingsEntity,
} from '../repository/entities/settings.entity';

export interface ISettingsEntity
  extends Omit<SettingsEntity, 'createdAt' | 'updatedAt'> {}

export interface ISettingsDoc
  extends Omit<SettingsDoc, 'createdAt' | 'updatedAt'> {}
