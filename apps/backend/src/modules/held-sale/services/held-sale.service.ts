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
import { HeldSaleCreateDto } from '../dtos/held-sale.create.dto';
import { HeldSaleUpdateDto } from '../dtos/held-sale.update.dto';
import {
  HeldSaleDoc,
  HeldSaleEntity,
} from '../repository/entities/held-sale.entity';
import { HeldSaleRepository } from '../repository/repositories/held-sale.repository';

@Injectable()
export class HeldSaleService {
  constructor(private readonly _heldSaleRepo: HeldSaleRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<HeldSaleEntity[]> {
    return await this._heldSaleRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<HeldSaleDoc> {
    return await this._heldSaleRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<HeldSaleDoc> {
    return await this._heldSaleRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._heldSaleRepo.getTotal(find, options);
  }

  async create(
    data: HeldSaleCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<HeldSaleDoc> {
    const entity = new HeldSaleEntity();
    Object.assign(entity, data);
    return await this._heldSaleRepo.create(entity, options);
  }

  async update(
    repository: HeldSaleDoc,
    data: HeldSaleUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<HeldSaleDoc> {
    Object.assign(repository, data);
    return await this._heldSaleRepo.save(repository, options);
  }

  async active(
    repository: HeldSaleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<HeldSaleDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._heldSaleRepo.save(repository, options);
  }

  async inactive(
    repository: HeldSaleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<HeldSaleDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._heldSaleRepo.save(repository, options);
  }

  async delete(
    repository: HeldSaleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<HeldSaleDoc> {
    return await this._heldSaleRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: HeldSaleDoc,
    options?: IDatabaseManyOptions,
  ): Promise<HeldSaleDoc> {
    return await this._heldSaleRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._heldSaleRepo.exists(find, options);
  }

  async createMany(
    data: HeldSaleCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._heldSaleRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._heldSaleRepo.deleteMany(find, options);
  }

  async _checkHeldSale(id: string): Promise<HeldSaleDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'heldSale.error.notFound',
      });
    }
    return doc;
  }
}
