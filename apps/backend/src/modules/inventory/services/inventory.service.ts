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
import { InventoryCreateDto } from '../dtos/inventory.create.dto';
import { InventoryUpdateDto } from '../dtos/inventory.update.dto';
import {
  InventoryDoc,
  InventoryEntity,
} from '../repository/entities/inventory.entity';
import { InventoryRepository } from '../repository/repositories/inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly _inventoryRepo: InventoryRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<InventoryEntity[]> {
    return await this._inventoryRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<InventoryDoc> {
    return await this._inventoryRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<InventoryDoc> {
    return await this._inventoryRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._inventoryRepo.getTotal(find, options);
  }

  async create(
    data: InventoryCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<InventoryDoc> {
    const entity = new InventoryEntity();
    Object.assign(entity, data);
    return await this._inventoryRepo.create(entity, options);
  }

  async update(
    repository: InventoryDoc,
    data: InventoryUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<InventoryDoc> {
    Object.assign(repository, data);
    return await this._inventoryRepo.save(repository, options);
  }

  async active(
    repository: InventoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<InventoryDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._inventoryRepo.save(repository, options);
  }

  async inactive(
    repository: InventoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<InventoryDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._inventoryRepo.save(repository, options);
  }

  async delete(
    repository: InventoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<InventoryDoc> {
    return await this._inventoryRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: InventoryDoc,
    options?: IDatabaseManyOptions,
  ): Promise<InventoryDoc> {
    return await this._inventoryRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._inventoryRepo.exists(find, options);
  }

  async createMany(
    data: InventoryCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._inventoryRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._inventoryRepo.deleteMany(find, options);
  }

  async _checkInventory(id: string): Promise<InventoryDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'inventory.error.notFound',
      });
    }
    return doc;
  }
}
