import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { ActivityLogCreateDto } from '../dtos/activity-log.create.dto';
import { ActivityLogUpdateDto } from '../dtos/activity-log.update.dto';
import {
  ActivityLogDoc,
  ActivityLogEntity,
} from '../repository/entities/activity-log.entity';
import { ActivityLogRepository } from '../repository/repositories/activity-log.repository';

@Injectable()
export class ActivityLogService {
  constructor(private readonly _activityLogRepo: ActivityLogRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<ActivityLogEntity[]> {
    return await this._activityLogRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ActivityLogDoc> {
    return await this._activityLogRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ActivityLogDoc> {
    return await this._activityLogRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._activityLogRepo.getTotal(find, options);
  }

  async create(
    data: ActivityLogCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<ActivityLogDoc> {
    const entity = new ActivityLogEntity();
    Object.assign(entity, data);
    return await this._activityLogRepo.create(entity, options);
  }

  async update(
    repository: ActivityLogDoc,
    data: ActivityLogUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ActivityLogDoc> {
    Object.assign(repository, data);
    return await this._activityLogRepo.save(repository, options);
  }

  async active(
    repository: ActivityLogDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ActivityLogDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._activityLogRepo.save(repository, options);
  }

  async inactive(
    repository: ActivityLogDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ActivityLogDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._activityLogRepo.save(repository, options);
  }

  async delete(
    repository: ActivityLogDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ActivityLogDoc> {
    return await this._activityLogRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: ActivityLogDoc,
    options?: IDatabaseManyOptions,
  ): Promise<ActivityLogDoc> {
    return await this._activityLogRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._activityLogRepo.exists(find, options);
  }

  async createMany(
    data: ActivityLogCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._activityLogRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._activityLogRepo.deleteMany(find, options);
  }

  async _checkActivityLog(id: string): Promise<ActivityLogDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'activityLog.error.notFound',
      });
    }
    return doc;
  }
}
