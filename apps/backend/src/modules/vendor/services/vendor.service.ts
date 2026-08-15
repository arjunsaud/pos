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
import { VendorCreateDto } from '../dtos/vendor.create.dto';
import { VendorUpdateDto } from '../dtos/vendor.update.dto';
import {
  VendorDoc,
  VendorEntity,
} from '../repository/entities/vendor.entity';
import { VendorRepository } from '../repository/repositories/vendor.repository';

@Injectable()
export class VendorService {
  constructor(private readonly _vendorRepo: VendorRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<VendorEntity[]> {
    return await this._vendorRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<VendorDoc> {
    return await this._vendorRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<VendorDoc> {
    return await this._vendorRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._vendorRepo.getTotal(find, options);
  }

  async create(
    data: VendorCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<VendorDoc> {
    const entity = new VendorEntity();
    Object.assign(entity, data);
    return await this._vendorRepo.create(entity, options);
  }

  async update(
    repository: VendorDoc,
    data: VendorUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VendorDoc> {
    Object.assign(repository, data);
    return await this._vendorRepo.save(repository, options);
  }

  async active(
    repository: VendorDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VendorDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._vendorRepo.save(repository, options);
  }

  async inactive(
    repository: VendorDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VendorDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._vendorRepo.save(repository, options);
  }

  async delete(
    repository: VendorDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VendorDoc> {
    return await this._vendorRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: VendorDoc,
    options?: IDatabaseManyOptions,
  ): Promise<VendorDoc> {
    return await this._vendorRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._vendorRepo.exists(find, options);
  }

  async createMany(
    data: VendorCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._vendorRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._vendorRepo.deleteMany(find, options);
  }

  async _checkVendor(id: string): Promise<VendorDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'vendor.error.notFound',
      });
    }
    return doc;
  }
}
