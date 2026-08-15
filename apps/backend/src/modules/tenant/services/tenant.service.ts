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
import { TenantCreateDto } from '../dtos/tenant.create.dto';
import { TenantUpdateDto } from '../dtos/tenant.update.dto';
import {
  TenantDoc,
  TenantEntity,
} from '../repository/entities/tenant.entity';
import { TenantRepository } from '../repository/repositories/tenant.repository';

@Injectable()
export class TenantService {
  constructor(private readonly _tenantRepo: TenantRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<TenantEntity[]> {
    return await this._tenantRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<TenantDoc> {
    return await this._tenantRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<TenantDoc> {
    return await this._tenantRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._tenantRepo.getTotal(find, options);
  }

  async create(
    data: TenantCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<TenantDoc> {
    const entity = new TenantEntity();
    Object.assign(entity, data);
    return await this._tenantRepo.create(entity, options);
  }

  async update(
    repository: TenantDoc,
    data: TenantUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<TenantDoc> {
    Object.assign(repository, data);
    return await this._tenantRepo.save(repository, options);
  }

  async active(
    repository: TenantDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<TenantDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._tenantRepo.save(repository, options);
  }

  async inactive(
    repository: TenantDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<TenantDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._tenantRepo.save(repository, options);
  }

  async delete(
    repository: TenantDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<TenantDoc> {
    return await this._tenantRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: TenantDoc,
    options?: IDatabaseManyOptions,
  ): Promise<TenantDoc> {
    return await this._tenantRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._tenantRepo.exists(find, options);
  }

  async createMany(
    data: TenantCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._tenantRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._tenantRepo.deleteMany(find, options);
  }

  async _checkTenant(id: string): Promise<TenantDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'tenant.error.notFound',
      });
    }
    return doc;
  }
}
