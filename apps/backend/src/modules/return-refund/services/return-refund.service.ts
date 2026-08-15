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
import { ReturnRefundCreateDto } from '../dtos/return-refund.create.dto';
import { ReturnRefundUpdateDto } from '../dtos/return-refund.update.dto';
import {
  ReturnRefundDoc,
  ReturnRefundEntity,
} from '../repository/entities/return-refund.entity';
import { ReturnRefundRepository } from '../repository/repositories/return-refund.repository';

@Injectable()
export class ReturnRefundService {
  constructor(private readonly _returnRefundRepo: ReturnRefundRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<ReturnRefundEntity[]> {
    return await this._returnRefundRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ReturnRefundDoc> {
    return await this._returnRefundRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ReturnRefundDoc> {
    return await this._returnRefundRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._returnRefundRepo.getTotal(find, options);
  }

  async create(
    data: ReturnRefundCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<ReturnRefundDoc> {
    const entity = new ReturnRefundEntity();
    Object.assign(entity, data);
    return await this._returnRefundRepo.create(entity, options);
  }

  async update(
    repository: ReturnRefundDoc,
    data: ReturnRefundUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ReturnRefundDoc> {
    Object.assign(repository, data);
    return await this._returnRefundRepo.save(repository, options);
  }

  async active(
    repository: ReturnRefundDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ReturnRefundDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._returnRefundRepo.save(repository, options);
  }

  async inactive(
    repository: ReturnRefundDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ReturnRefundDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._returnRefundRepo.save(repository, options);
  }

  async delete(
    repository: ReturnRefundDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ReturnRefundDoc> {
    return await this._returnRefundRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: ReturnRefundDoc,
    options?: IDatabaseManyOptions,
  ): Promise<ReturnRefundDoc> {
    return await this._returnRefundRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._returnRefundRepo.exists(find, options);
  }

  async createMany(
    data: ReturnRefundCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._returnRefundRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._returnRefundRepo.deleteMany(find, options);
  }

  async _checkReturnRefund(id: string): Promise<ReturnRefundDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'returnRefund.error.notFound',
      });
    }
    return doc;
  }
}
