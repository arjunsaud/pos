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
import { NotificationCreateDto } from '../dtos/notification.create.dto';
import { NotificationUpdateDto } from '../dtos/notification.update.dto';
import {
  NotificationDoc,
  NotificationEntity,
} from '../repository/entities/notification.entity';
import { NotificationRepository } from '../repository/repositories/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly _notificationRepo: NotificationRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<NotificationEntity[]> {
    return await this._notificationRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<NotificationDoc> {
    return await this._notificationRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<NotificationDoc> {
    return await this._notificationRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._notificationRepo.getTotal(find, options);
  }

  async create(
    data: NotificationCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<NotificationDoc> {
    const entity = new NotificationEntity();
    Object.assign(entity, data);
    return await this._notificationRepo.create(entity, options);
  }

  async update(
    repository: NotificationDoc,
    data: NotificationUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<NotificationDoc> {
    Object.assign(repository, data);
    return await this._notificationRepo.save(repository, options);
  }

  async active(
    repository: NotificationDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<NotificationDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._notificationRepo.save(repository, options);
  }

  async inactive(
    repository: NotificationDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<NotificationDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._notificationRepo.save(repository, options);
  }

  async delete(
    repository: NotificationDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<NotificationDoc> {
    return await this._notificationRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: NotificationDoc,
    options?: IDatabaseManyOptions,
  ): Promise<NotificationDoc> {
    return await this._notificationRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._notificationRepo.exists(find, options);
  }

  async createMany(
    data: NotificationCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._notificationRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._notificationRepo.deleteMany(find, options);
  }

  async _checkNotification(id: string): Promise<NotificationDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'notification.error.notFound',
      });
    }
    return doc;
  }
}
