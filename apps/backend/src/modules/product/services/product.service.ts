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
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import {
  ProductDoc,
  ProductEntity,
} from '../repository/entities/product.entity';
import { ProductRepository } from '../repository/repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly _productRepo: ProductRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<ProductEntity[]> {
    return await this._productRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ProductDoc> {
    return await this._productRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<ProductDoc> {
    return await this._productRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._productRepo.getTotal(find, options);
  }

  async create(
    data: ProductCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<ProductDoc> {
    const entity = new ProductEntity();
    Object.assign(entity, data);
    return await this._productRepo.create(entity, options);
  }

  async update(
    repository: ProductDoc,
    data: ProductUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ProductDoc> {
    Object.assign(repository, data);
    return await this._productRepo.save(repository, options);
  }

  async active(
    repository: ProductDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ProductDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._productRepo.save(repository, options);
  }

  async inactive(
    repository: ProductDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ProductDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._productRepo.save(repository, options);
  }

  async delete(
    repository: ProductDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ProductDoc> {
    return await this._productRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: ProductDoc,
    options?: IDatabaseManyOptions,
  ): Promise<ProductDoc> {
    return await this._productRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._productRepo.exists(find, options);
  }

  async createMany(
    data: ProductCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._productRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._productRepo.deleteMany(find, options);
  }

  async _checkProduct(id: string): Promise<ProductDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'product.error.notFound',
      });
    }
    return doc;
  }
}
