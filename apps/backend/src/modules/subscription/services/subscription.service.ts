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
import { SubscriptionCreateDto } from '../dtos/subscription.create.dto';
import { SubscriptionUpdateDto } from '../dtos/subscription.update.dto';
import {
  SubscriptionDoc,
  SubscriptionEntity,
} from '../repository/entities/subscription.entity';
import { SubscriptionRepository } from '../repository/repositories/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(private readonly _subscriptionRepo: SubscriptionRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<SubscriptionEntity[]> {
    return await this._subscriptionRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SubscriptionDoc> {
    return await this._subscriptionRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SubscriptionDoc> {
    return await this._subscriptionRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._subscriptionRepo.getTotal(find, options);
  }

  async create(
    data: SubscriptionCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<SubscriptionDoc> {
    const entity = new SubscriptionEntity();
    Object.assign(entity, data);
    return await this._subscriptionRepo.create(entity, options);
  }

  async update(
    repository: SubscriptionDoc,
    data: SubscriptionUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<SubscriptionDoc> {
    Object.assign(repository, data);
    return await this._subscriptionRepo.save(repository, options);
  }

  async active(
    repository: SubscriptionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SubscriptionDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._subscriptionRepo.save(repository, options);
  }

  async inactive(
    repository: SubscriptionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SubscriptionDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._subscriptionRepo.save(repository, options);
  }

  async delete(
    repository: SubscriptionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SubscriptionDoc> {
    return await this._subscriptionRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: SubscriptionDoc,
    options?: IDatabaseManyOptions,
  ): Promise<SubscriptionDoc> {
    return await this._subscriptionRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._subscriptionRepo.exists(find, options);
  }

  async createMany(
    data: SubscriptionCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._subscriptionRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._subscriptionRepo.deleteMany(find, options);
  }

  async _checkSubscription(id: string): Promise<SubscriptionDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'subscription.error.notFound',
      });
    }
    return doc;
  }
}
