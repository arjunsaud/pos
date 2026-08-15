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
import { ContentCreateDto } from '../dtos/content.create.dto';
import { ContentUpdateDto } from '../dtos/content.update.dto';
import {
  ContentDoc,
  ContentEntity,
} from '../repository/entities/content.entity';
import { ContentRepository } from '../repository/repositories/content.repository';

@Injectable()
export class ContentService {
  constructor(private readonly _contentRepo: ContentRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<ContentEntity[]> {
    return await this._contentRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ContentDoc> {
    return await this._contentRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ContentDoc> {
    return await this._contentRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._contentRepo.getTotal(find, options);
  }

  async create(
    data: ContentCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<ContentDoc> {
    const entity = new ContentEntity();
    Object.assign(entity, data);
    return await this._contentRepo.create(entity, options);
  }

  async update(
    repository: ContentDoc,
    data: ContentUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ContentDoc> {
    Object.assign(repository, data);
    return await this._contentRepo.save(repository, options);
  }

  async active(
    repository: ContentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ContentDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._contentRepo.save(repository, options);
  }

  async inactive(
    repository: ContentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ContentDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._contentRepo.save(repository, options);
  }

  async delete(
    repository: ContentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ContentDoc> {
    return await this._contentRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: ContentDoc,
    options?: IDatabaseManyOptions,
  ): Promise<ContentDoc> {
    return await this._contentRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._contentRepo.exists(find, options);
  }

  async createMany(
    data: ContentCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._contentRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._contentRepo.deleteMany(find, options);
  }

  async _checkContent(id: string): Promise<ContentDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'content.error.notFound',
      });
    }
    return doc;
  }
}
