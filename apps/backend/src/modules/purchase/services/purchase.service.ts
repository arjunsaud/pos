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
import { PurchaseCreateDto } from '../dtos/purchase.create.dto';
import { PurchaseUpdateDto } from '../dtos/purchase.update.dto';
import {
  PurchaseDoc,
  PurchaseEntity,
} from '../repository/entities/purchase.entity';
import { PurchaseRepository } from '../repository/repositories/purchase.repository';

@Injectable()
export class PurchaseService {
  constructor(private readonly _purchaseRepo: PurchaseRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<PurchaseEntity[]> {
    return await this._purchaseRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PurchaseDoc> {
    return await this._purchaseRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PurchaseDoc> {
    return await this._purchaseRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._purchaseRepo.getTotal(find, options);
  }

  async create(
    data: PurchaseCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<PurchaseDoc> {
    const entity = new PurchaseEntity();
    Object.assign(entity, data);
    return await this._purchaseRepo.create(entity, options);
  }

  async update(
    repository: PurchaseDoc,
    data: PurchaseUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PurchaseDoc> {
    Object.assign(repository, data);
    return await this._purchaseRepo.save(repository, options);
  }

  async active(
    repository: PurchaseDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PurchaseDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._purchaseRepo.save(repository, options);
  }

  async inactive(
    repository: PurchaseDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PurchaseDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._purchaseRepo.save(repository, options);
  }

  async delete(
    repository: PurchaseDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PurchaseDoc> {
    return await this._purchaseRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: PurchaseDoc,
    options?: IDatabaseManyOptions,
  ): Promise<PurchaseDoc> {
    return await this._purchaseRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._purchaseRepo.exists(find, options);
  }

  async createMany(
    data: PurchaseCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._purchaseRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._purchaseRepo.deleteMany(find, options);
  }

  async _checkPurchase(id: string): Promise<PurchaseDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'purchase.error.notFound',
      });
    }
    return doc;
  }
}
