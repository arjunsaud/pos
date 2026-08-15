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
import { PaymentMethodCreateDto } from '../dtos/payment-method.create.dto';
import { PaymentMethodUpdateDto } from '../dtos/payment-method.update.dto';
import {
  PaymentMethodDoc,
  PaymentMethodEntity,
} from '../repository/entities/payment-method.entity';
import { PaymentMethodRepository } from '../repository/repositories/payment-method.repository';

@Injectable()
export class PaymentMethodService {
  constructor(private readonly _paymentMethodRepo: PaymentMethodRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<PaymentMethodEntity[]> {
    return await this._paymentMethodRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PaymentMethodDoc> {
    return await this._paymentMethodRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PaymentMethodDoc> {
    return await this._paymentMethodRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._paymentMethodRepo.getTotal(find, options);
  }

  async create(
    data: PaymentMethodCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<PaymentMethodDoc> {
    const entity = new PaymentMethodEntity();
    Object.assign(entity, data);
    return await this._paymentMethodRepo.create(entity, options);
  }

  async update(
    repository: PaymentMethodDoc,
    data: PaymentMethodUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentMethodDoc> {
    Object.assign(repository, data);
    return await this._paymentMethodRepo.save(repository, options);
  }

  async active(
    repository: PaymentMethodDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentMethodDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._paymentMethodRepo.save(repository, options);
  }

  async inactive(
    repository: PaymentMethodDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentMethodDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._paymentMethodRepo.save(repository, options);
  }

  async delete(
    repository: PaymentMethodDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentMethodDoc> {
    return await this._paymentMethodRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: PaymentMethodDoc,
    options?: IDatabaseManyOptions,
  ): Promise<PaymentMethodDoc> {
    return await this._paymentMethodRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._paymentMethodRepo.exists(find, options);
  }

  async createMany(
    data: PaymentMethodCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._paymentMethodRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._paymentMethodRepo.deleteMany(find, options);
  }

  async _checkPaymentMethod(id: string): Promise<PaymentMethodDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'paymentMethod.error.notFound',
      });
    }
    return doc;
  }
}
