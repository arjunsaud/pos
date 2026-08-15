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
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { CategoryUpdateDto } from '../dtos/category.update.dto';
import {
  CategoryDoc,
  CategoryEntity,
} from '../repository/entities/category.entity';
import { CategoryRepository } from '../repository/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly _categoryRepo: CategoryRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<CategoryEntity[]> {
    return await this._categoryRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<CategoryDoc> {
    return await this._categoryRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<CategoryDoc> {
    return await this._categoryRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._categoryRepo.getTotal(find, options);
  }

  async create(
    data: CategoryCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<CategoryDoc> {
    const entity = new CategoryEntity();
    Object.assign(entity, data);
    return await this._categoryRepo.create(entity, options);
  }

  async update(
    repository: CategoryDoc,
    data: CategoryUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CategoryDoc> {
    Object.assign(repository, data);
    return await this._categoryRepo.save(repository, options);
  }

  async active(
    repository: CategoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CategoryDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._categoryRepo.save(repository, options);
  }

  async inactive(
    repository: CategoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CategoryDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._categoryRepo.save(repository, options);
  }

  async delete(
    repository: CategoryDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CategoryDoc> {
    return await this._categoryRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: CategoryDoc,
    options?: IDatabaseManyOptions,
  ): Promise<CategoryDoc> {
    return await this._categoryRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._categoryRepo.exists(find, options);
  }

  async createMany(
    data: CategoryCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._categoryRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._categoryRepo.deleteMany(find, options);
  }

  async _checkCategory(id: string): Promise<CategoryDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'category.error.notFound',
      });
    }
    return doc;
  }
}
