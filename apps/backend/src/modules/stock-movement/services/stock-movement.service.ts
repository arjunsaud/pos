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
import { StockMovementCreateDto } from '../dtos/stock-movement.create.dto';
import { StockMovementUpdateDto } from '../dtos/stock-movement.update.dto';
import {
  StockMovementDoc,
  StockMovementEntity,
} from '../repository/entities/stock-movement.entity';
import { StockMovementRepository } from '../repository/repositories/stock-movement.repository';

@Injectable()
export class StockMovementService {
  constructor(private readonly _stockMovementRepo: StockMovementRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<StockMovementEntity[]> {
    return await this._stockMovementRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<StockMovementDoc> {
    return await this._stockMovementRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<StockMovementDoc> {
    return await this._stockMovementRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._stockMovementRepo.getTotal(find, options);
  }

  async create(
    data: StockMovementCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<StockMovementDoc> {
    const entity = new StockMovementEntity();
    Object.assign(entity, data);
    return await this._stockMovementRepo.create(entity, options);
  }

  async update(
    repository: StockMovementDoc,
    data: StockMovementUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<StockMovementDoc> {
    Object.assign(repository, data);
    return await this._stockMovementRepo.save(repository, options);
  }

  async active(
    repository: StockMovementDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StockMovementDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._stockMovementRepo.save(repository, options);
  }

  async inactive(
    repository: StockMovementDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StockMovementDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._stockMovementRepo.save(repository, options);
  }

  async delete(
    repository: StockMovementDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<StockMovementDoc> {
    return await this._stockMovementRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: StockMovementDoc,
    options?: IDatabaseManyOptions,
  ): Promise<StockMovementDoc> {
    return await this._stockMovementRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._stockMovementRepo.exists(find, options);
  }

  async createMany(
    data: StockMovementCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._stockMovementRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._stockMovementRepo.deleteMany(find, options);
  }

  async _checkStockMovement(id: string): Promise<StockMovementDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'stockMovement.error.notFound',
      });
    }
    return doc;
  }
}
