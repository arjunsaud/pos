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
import { PaymentReceiptCreateDto } from '../dtos/payment-receipt.create.dto';
import { PaymentReceiptUpdateDto } from '../dtos/payment-receipt.update.dto';
import {
  PaymentReceiptDoc,
  PaymentReceiptEntity,
} from '../repository/entities/payment-receipt.entity';
import { PaymentReceiptRepository } from '../repository/repositories/payment-receipt.repository';

@Injectable()
export class PaymentReceiptService {
  constructor(private readonly _paymentReceiptRepo: PaymentReceiptRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<PaymentReceiptEntity[]> {
    return await this._paymentReceiptRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PaymentReceiptDoc> {
    return await this._paymentReceiptRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PaymentReceiptDoc> {
    return await this._paymentReceiptRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._paymentReceiptRepo.getTotal(find, options);
  }

  async create(
    data: PaymentReceiptCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<PaymentReceiptDoc> {
    const entity = new PaymentReceiptEntity();
    Object.assign(entity, data);
    return await this._paymentReceiptRepo.create(entity, options);
  }

  async update(
    repository: PaymentReceiptDoc,
    data: PaymentReceiptUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentReceiptDoc> {
    Object.assign(repository, data);
    return await this._paymentReceiptRepo.save(repository, options);
  }

  async active(
    repository: PaymentReceiptDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentReceiptDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._paymentReceiptRepo.save(repository, options);
  }

  async inactive(
    repository: PaymentReceiptDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentReceiptDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._paymentReceiptRepo.save(repository, options);
  }

  async delete(
    repository: PaymentReceiptDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PaymentReceiptDoc> {
    return await this._paymentReceiptRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: PaymentReceiptDoc,
    options?: IDatabaseManyOptions,
  ): Promise<PaymentReceiptDoc> {
    return await this._paymentReceiptRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._paymentReceiptRepo.exists(find, options);
  }

  async createMany(
    data: PaymentReceiptCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._paymentReceiptRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._paymentReceiptRepo.deleteMany(find, options);
  }

  async _checkPaymentReceipt(id: string): Promise<PaymentReceiptDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'paymentReceipt.error.notFound',
      });
    }
    return doc;
  }
}
