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
import { ContractCreateDto } from '../dtos/contract.create.dto';
import { ContractUpdateDto } from '../dtos/contract.update.dto';
import {
  ContractDoc,
  ContractEntity,
} from '../repository/entities/contract.entity';
import { ContractRepository } from '../repository/repositories/contract.repository';

@Injectable()
export class ContractService {
  constructor(private readonly _contractRepo: ContractRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<ContractEntity[]> {
    return await this._contractRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ContractDoc> {
    return await this._contractRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ContractDoc> {
    return await this._contractRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._contractRepo.getTotal(find, options);
  }

  async create(
    data: ContractCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<ContractDoc> {
    const entity = new ContractEntity();
    Object.assign(entity, data);
    return await this._contractRepo.create(entity, options);
  }

  async update(
    repository: ContractDoc,
    data: ContractUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ContractDoc> {
    Object.assign(repository, data);
    return await this._contractRepo.save(repository, options);
  }

  async active(
    repository: ContractDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ContractDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._contractRepo.save(repository, options);
  }

  async inactive(
    repository: ContractDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ContractDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._contractRepo.save(repository, options);
  }

  async delete(
    repository: ContractDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ContractDoc> {
    return await this._contractRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: ContractDoc,
    options?: IDatabaseManyOptions,
  ): Promise<ContractDoc> {
    return await this._contractRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._contractRepo.exists(find, options);
  }

  async createMany(
    data: ContractCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._contractRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._contractRepo.deleteMany(find, options);
  }

  async _checkContract(id: string): Promise<ContractDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'contract.error.notFound',
      });
    }
    return doc;
  }
}
