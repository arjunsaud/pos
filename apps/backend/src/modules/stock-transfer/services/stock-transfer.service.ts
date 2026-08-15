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
import { StockTransferCreateDto } from '../dtos/stock-transfer.create.dto';
import { StockTransferUpdateDto } from '../dtos/stock-transfer.update.dto';
import {
  StockTransferDoc,
  StockTransferEntity,
} from '../repository/entities/stock-transfer.entity';
import { StockTransferRepository } from '../repository/repositories/stock-transfer.repository';

@Injectable()
export class StockTransferService {
  constructor(private readonly _stockTransferRepo: StockTransferRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<StockTransferEntity[]> {
    return await this._stockTransferRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<StockTransferDoc> {
    return await this._stockTransferRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<StockTransferDoc> {
    return await this._stockTransferRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._stockTransferRepo.getTotal(find, options);
  }

  async create(
    data: StockTransferCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<StockTransferDoc> {
    const entity = new StockTransferEntity();
    Object.assign(entity, data);
    return await this._stockTransferRepo.create(entity, options);
  }

  async update(
    repository: StockTransferDoc,
    data: StockTransferUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<StockTransferDoc> {
    Object.assign(repository, data);
    return await this._stockTransferRepo.save(repository, options);
  }

  async active(
    repository: StockTransferDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StockTransferDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._stockTransferRepo.save(repository, options);
  }

  async inactive(
    repository: StockTransferDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StockTransferDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._stockTransferRepo.save(repository, options);
  }

  async delete(
    repository: StockTransferDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StockTransferDoc> {
    return await this._stockTransferRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: StockTransferDoc,
    options?: IDatabaseManyOptions,
  ): Promise<StockTransferDoc> {
    return await this._stockTransferRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._stockTransferRepo.exists(find, options);
  }

  async createMany(
    data: StockTransferCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._stockTransferRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._stockTransferRepo.deleteMany(find, options);
  }

  async _checkStockTransfer(id: string): Promise<StockTransferDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'stockTransfer.error.notFound',
      });
    }
    return doc;
  }
}
