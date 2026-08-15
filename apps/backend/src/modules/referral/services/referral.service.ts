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
import { ReferralCreateDto } from '../dtos/referral.create.dto';
import { ReferralUpdateDto } from '../dtos/referral.update.dto';
import {
  ReferralDoc,
  ReferralEntity,
} from '../repository/entities/referral.entity';
import { ReferralRepository } from '../repository/repositories/referral.repository';

@Injectable()
export class ReferralService {
  constructor(private readonly _referralRepo: ReferralRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<ReferralEntity[]> {
    return await this._referralRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ReferralDoc> {
    return await this._referralRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ReferralDoc> {
    return await this._referralRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._referralRepo.getTotal(find, options);
  }

  async create(
    data: ReferralCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<ReferralDoc> {
    const entity = new ReferralEntity();
    Object.assign(entity, data);
    return await this._referralRepo.create(entity, options);
  }

  async update(
    repository: ReferralDoc,
    data: ReferralUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ReferralDoc> {
    Object.assign(repository, data);
    return await this._referralRepo.save(repository, options);
  }

  async active(
    repository: ReferralDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ReferralDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._referralRepo.save(repository, options);
  }

  async inactive(
    repository: ReferralDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ReferralDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._referralRepo.save(repository, options);
  }

  async delete(
    repository: ReferralDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ReferralDoc> {
    return await this._referralRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: ReferralDoc,
    options?: IDatabaseManyOptions,
  ): Promise<ReferralDoc> {
    return await this._referralRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._referralRepo.exists(find, options);
  }

  async createMany(
    data: ReferralCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._referralRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._referralRepo.deleteMany(find, options);
  }

  async _checkReferral(id: string): Promise<ReferralDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'referral.error.notFound',
      });
    }
    return doc;
  }
}
