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
import { CustomerCreateDto } from '../dtos/customer.create.dto';
import { CustomerUpdateDto } from '../dtos/customer.update.dto';
import {
  CustomerDoc,
  CustomerEntity,
} from '../repository/entities/customer.entity';
import { CustomerRepository } from '../repository/repositories/customer.repository';

@Injectable()
export class CustomerService {
  constructor(private readonly _customerRepo: CustomerRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<CustomerEntity[]> {
    return await this._customerRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<CustomerDoc> {
    return await this._customerRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<CustomerDoc> {
    return await this._customerRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._customerRepo.getTotal(find, options);
  }

  async create(
    data: CustomerCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<CustomerDoc> {
    const entity = new CustomerEntity();
    Object.assign(entity, data);
    return await this._customerRepo.create(entity, options);
  }

  async update(
    repository: CustomerDoc,
    data: CustomerUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CustomerDoc> {
    Object.assign(repository, data);
    return await this._customerRepo.save(repository, options);
  }

  async active(
    repository: CustomerDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CustomerDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._customerRepo.save(repository, options);
  }

  async inactive(
    repository: CustomerDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CustomerDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._customerRepo.save(repository, options);
  }

  async delete(
    repository: CustomerDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CustomerDoc> {
    return await this._customerRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: CustomerDoc,
    options?: IDatabaseManyOptions,
  ): Promise<CustomerDoc> {
    return await this._customerRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._customerRepo.exists(find, options);
  }

  async createMany(
    data: CustomerCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._customerRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._customerRepo.deleteMany(find, options);
  }

  async _checkCustomer(id: string): Promise<CustomerDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'customer.error.notFound',
      });
    }
    return doc;
  }
}
