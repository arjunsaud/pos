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
import { OutletCreateDto } from '../dtos/outlet.create.dto';
import { OutletUpdateDto } from '../dtos/outlet.update.dto';
import {
  OutletDoc,
  OutletEntity,
} from '../repository/entities/outlet.entity';
import { OutletRepository } from '../repository/repositories/outlet.repository';

@Injectable()
export class OutletService {
  constructor(private readonly _outletRepo: OutletRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<OutletEntity[]> {
    return await this._outletRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<OutletDoc> {
    return await this._outletRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<OutletDoc> {
    return await this._outletRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._outletRepo.getTotal(find, options);
  }

  async create(
    data: OutletCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<OutletDoc> {
    const entity = new OutletEntity();
    Object.assign(entity, data);
    return await this._outletRepo.create(entity, options);
  }

  async update(
    repository: OutletDoc,
    data: OutletUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<OutletDoc> {
    Object.assign(repository, data);
    return await this._outletRepo.save(repository, options);
  }

  async active(
    repository: OutletDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<OutletDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._outletRepo.save(repository, options);
  }

  async inactive(
    repository: OutletDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<OutletDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._outletRepo.save(repository, options);
  }

  async delete(
    repository: OutletDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<OutletDoc> {
    return await this._outletRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: OutletDoc,
    options?: IDatabaseManyOptions,
  ): Promise<OutletDoc> {
    return await this._outletRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._outletRepo.exists(find, options);
  }

  async createMany(
    data: OutletCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._outletRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._outletRepo.deleteMany(find, options);
  }

  async _checkOutlet(id: string): Promise<OutletDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'outlet.error.notFound',
      });
    }
    return doc;
  }
}
