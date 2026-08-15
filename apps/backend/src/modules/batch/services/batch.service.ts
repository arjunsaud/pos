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
import { BatchCreateDto } from '../dtos/batch.create.dto';
import { BatchUpdateDto } from '../dtos/batch.update.dto';
import {
  BatchDoc,
  BatchEntity,
} from '../repository/entities/batch.entity';
import { BatchRepository } from '../repository/repositories/batch.repository';

@Injectable()
export class BatchService {
  constructor(private readonly _batchRepo: BatchRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<BatchEntity[]> {
    return await this._batchRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<BatchDoc> {
    return await this._batchRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<BatchDoc> {
    return await this._batchRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._batchRepo.getTotal(find, options);
  }

  async create(
    data: BatchCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<BatchDoc> {
    const entity = new BatchEntity();
    Object.assign(entity, data);
    return await this._batchRepo.create(entity, options);
  }

  async update(
    repository: BatchDoc,
    data: BatchUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<BatchDoc> {
    Object.assign(repository, data);
    return await this._batchRepo.save(repository, options);
  }

  async active(
    repository: BatchDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<BatchDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._batchRepo.save(repository, options);
  }

  async inactive(
    repository: BatchDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<BatchDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._batchRepo.save(repository, options);
  }

  async delete(
    repository: BatchDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<BatchDoc> {
    return await this._batchRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: BatchDoc,
    options?: IDatabaseManyOptions,
  ): Promise<BatchDoc> {
    return await this._batchRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._batchRepo.exists(find, options);
  }

  async createMany(
    data: BatchCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._batchRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._batchRepo.deleteMany(find, options);
  }

  async _checkBatch(id: string): Promise<BatchDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'batch.error.notFound',
      });
    }
    return doc;
  }
}
