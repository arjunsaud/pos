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
import { FeatureCreateDto } from '../dtos/feature.create.dto';
import { FeatureUpdateDto } from '../dtos/feature.update.dto';
import {
  FeatureDoc,
  FeatureEntity,
} from '../repository/entities/feature.entity';
import { FeatureRepository } from '../repository/repositories/feature.repository';

@Injectable()
export class FeatureService {
  constructor(private readonly _featureRepo: FeatureRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<FeatureEntity[]> {
    return await this._featureRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<FeatureDoc> {
    return await this._featureRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<FeatureDoc> {
    return await this._featureRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._featureRepo.getTotal(find, options);
  }

  async create(
    data: FeatureCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<FeatureDoc> {
    const entity = new FeatureEntity();
    Object.assign(entity, data);
    return await this._featureRepo.create(entity, options);
  }

  async update(
    repository: FeatureDoc,
    data: FeatureUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<FeatureDoc> {
    Object.assign(repository, data);
    return await this._featureRepo.save(repository, options);
  }

  async active(
    repository: FeatureDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<FeatureDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._featureRepo.save(repository, options);
  }

  async inactive(
    repository: FeatureDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<FeatureDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._featureRepo.save(repository, options);
  }

  async delete(
    repository: FeatureDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<FeatureDoc> {
    return await this._featureRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: FeatureDoc,
    options?: IDatabaseManyOptions,
  ): Promise<FeatureDoc> {
    return await this._featureRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._featureRepo.exists(find, options);
  }

  async createMany(
    data: FeatureCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._featureRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._featureRepo.deleteMany(find, options);
  }

  async _checkFeature(id: string): Promise<FeatureDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'feature.error.notFound',
      });
    }
    return doc;
  }
}
