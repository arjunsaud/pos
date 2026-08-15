import { Injectable } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import {
  UpdateMaintenanceModeDto,
  UpdatePagesDto,
} from '../dto/update-settings-extra.dto';
import { ISettingsService } from '../interfaces/settings.service.interface';
import {
  SettingsDoc,
  SettingsEntity,
} from '../repository/entities/settings.entity';
import { SettingsRepository } from '../repository/repositories/settings.repository';

@Injectable()
export class SettingsService implements ISettingsService {
  constructor(private readonly repository: SettingsRepository) {}

  async onModuleInit() {
    const check = await this.findOne({});
    if (!check) {
      await this.repository.create({
        isPartialPayment: false,
        partialPayment: 0,
        serviceCharge: 0,
      });
    }
  }
  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<SettingsEntity[]> {
    return await this.repository.findAll(find, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SettingsDoc> {
    return await this.repository.findOne(find, options);
  }

  async delete(
    repository: SettingsDoc,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SettingsDoc> {
    return await this.repository.delete(repository, options);
  }

  async create(
    data: UpdateSettingsDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<SettingsDoc> {
    const settingsData = new SettingsEntity();
    Object.assign(settingsData, data);
    return await this.repository.create(settingsData, options);
  }

  async update(
    repository: SettingsDoc,
    data: UpdateSettingsDto,
    options?: IDatabaseSaveOptions,
  ): Promise<SettingsDoc> {
    if (data.isPartialPayment) {
      repository.isPartialPayment = data.isPartialPayment;
    }
    if (data.partialPayment) {
      repository.partialPayment = data.partialPayment;
    }
    if (data.serviceCharge) {
      repository.serviceCharge = data.serviceCharge;
    }
    return await this.repository.save(repository, options);
  }

  async updateMaintenanceMode(
    repository: SettingsDoc,
    data: UpdateMaintenanceModeDto,
    options?: IDatabaseSaveOptions,
  ): Promise<SettingsDoc> {
    repository.maintenanceMode = data.maintenanceMode;
    return await this.repository.save(repository, options);
  }

  async updatePages(
    repository: SettingsDoc,
    data: UpdatePagesDto,
    options?: IDatabaseSaveOptions,
  ): Promise<SettingsDoc> {
    if (!repository.pages) {
      repository.pages = [];
    }

    for (const newPage of data.pages) {
      const index = repository.pages.findIndex(p => p.key === newPage.key);
      if (index > -1) {
        repository.pages[index] = { ...repository.pages[index], ...newPage };
      } else {
        repository.pages.push({
          ...newPage,
          isActive: newPage.isActive ?? true,
        });
      }
    }
    return await this.repository.save(repository, options);
  }
}

