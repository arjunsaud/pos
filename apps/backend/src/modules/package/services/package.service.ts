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
import { PackageCreateDto } from '../dtos/package.create.dto';
import { PackageUpdateDto } from '../dtos/package.update.dto';
import {
  PackageDoc,
  PackageEntity,
} from '../repository/entities/package.entity';
import { PackageRepository } from '../repository/repositories/package.repository';

@Injectable()
export class PackageService {
  constructor(private readonly _packageRepo: PackageRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<PackageEntity[]> {
    return await this._packageRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PackageDoc> {
    return await this._packageRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PackageDoc> {
    return await this._packageRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._packageRepo.getTotal(find, options);
  }

  async create(
    data: PackageCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<PackageDoc> {
    const entity = new PackageEntity();
    Object.assign(entity, data);
    return await this._packageRepo.create(entity, options);
  }

  async update(
    repository: PackageDoc,
    data: PackageUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PackageDoc> {
    Object.assign(repository, data);
    return await this._packageRepo.save(repository, options);
  }

  async active(
    repository: PackageDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PackageDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._packageRepo.save(repository, options);
  }

  async inactive(
    repository: PackageDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PackageDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._packageRepo.save(repository, options);
  }

  async delete(
    repository: PackageDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PackageDoc> {
    return await this._packageRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: PackageDoc,
    options?: IDatabaseManyOptions,
  ): Promise<PackageDoc> {
    return await this._packageRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._packageRepo.exists(find, options);
  }

  async createMany(
    data: PackageCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._packageRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._packageRepo.deleteMany(find, options);
  }

  async _checkPackage(id: string): Promise<PackageDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'package.error.notFound',
      });
    }
    return doc;
  }
}
