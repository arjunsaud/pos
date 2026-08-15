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
import { SaleCreateDto } from '../dtos/sale.create.dto';
import { SaleUpdateDto } from '../dtos/sale.update.dto';
import {
  SaleDoc,
  SaleEntity,
} from '../repository/entities/sale.entity';
import { SaleRepository } from '../repository/repositories/sale.repository';

@Injectable()
export class SaleService {
  constructor(private readonly _saleRepo: SaleRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<SaleEntity[]> {
    return await this._saleRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SaleDoc> {
    return await this._saleRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SaleDoc> {
    return await this._saleRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._saleRepo.getTotal(find, options);
  }

  async create(
    data: SaleCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<SaleDoc> {
    const entity = new SaleEntity();
    Object.assign(entity, data);
    return await this._saleRepo.create(entity, options);
  }

  async update(
    repository: SaleDoc,
    data: SaleUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<SaleDoc> {
    Object.assign(repository, data);
    return await this._saleRepo.save(repository, options);
  }

  async active(
    repository: SaleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SaleDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._saleRepo.save(repository, options);
  }

  async inactive(
    repository: SaleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SaleDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._saleRepo.save(repository, options);
  }

  async delete(
    repository: SaleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SaleDoc> {
    return await this._saleRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: SaleDoc,
    options?: IDatabaseManyOptions,
  ): Promise<SaleDoc> {
    return await this._saleRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._saleRepo.exists(find, options);
  }

  async createMany(
    data: SaleCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._saleRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._saleRepo.deleteMany(find, options);
  }

  async _checkSale(id: string): Promise<SaleDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'sale.error.notFound',
      });
    }
    return doc;
  }
}
