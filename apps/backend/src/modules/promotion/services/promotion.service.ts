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
import { PromotionCreateDto } from '../dtos/promotion.create.dto';
import { PromotionUpdateDto } from '../dtos/promotion.update.dto';
import {
  PromotionDoc,
  PromotionEntity,
} from '../repository/entities/promotion.entity';
import { PromotionRepository } from '../repository/repositories/promotion.repository';

@Injectable()
export class PromotionService {
  constructor(private readonly _promotionRepo: PromotionRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<PromotionEntity[]> {
    return await this._promotionRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PromotionDoc> {
    return await this._promotionRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<PromotionDoc> {
    return await this._promotionRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._promotionRepo.getTotal(find, options);
  }

  async create(
    data: PromotionCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<PromotionDoc> {
    const entity = new PromotionEntity();
    Object.assign(entity, data);
    return await this._promotionRepo.create(entity, options);
  }

  async update(
    repository: PromotionDoc,
    data: PromotionUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PromotionDoc> {
    Object.assign(repository, data);
    return await this._promotionRepo.save(repository, options);
  }

  async active(
    repository: PromotionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PromotionDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._promotionRepo.save(repository, options);
  }

  async inactive(
    repository: PromotionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PromotionDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._promotionRepo.save(repository, options);
  }

  async delete(
    repository: PromotionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PromotionDoc> {
    return await this._promotionRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: PromotionDoc,
    options?: IDatabaseManyOptions,
  ): Promise<PromotionDoc> {
    return await this._promotionRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._promotionRepo.exists(find, options);
  }

  async createMany(
    data: PromotionCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._promotionRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._promotionRepo.deleteMany(find, options);
  }

  async _checkPromotion(id: string): Promise<PromotionDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'promotion.error.notFound',
      });
    }
    return doc;
  }
}
