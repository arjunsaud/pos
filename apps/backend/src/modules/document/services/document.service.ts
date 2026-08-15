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
import { DocumentCreateDto } from '../dtos/document.create.dto';
import { DocumentUpdateDto } from '../dtos/document.update.dto';
import {
  DocumentDoc,
  DocumentEntity,
} from '../repository/entities/document.entity';
import { DocumentRepository } from '../repository/repositories/document.repository';

@Injectable()
export class DocumentService {
  constructor(private readonly _documentRepo: DocumentRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<DocumentEntity[]> {
    return await this._documentRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<DocumentDoc> {
    return await this._documentRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<DocumentDoc> {
    return await this._documentRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._documentRepo.getTotal(find, options);
  }

  async create(
    data: DocumentCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<DocumentDoc> {
    const entity = new DocumentEntity();
    Object.assign(entity, data);
    return await this._documentRepo.create(entity, options);
  }

  async update(
    repository: DocumentDoc,
    data: DocumentUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<DocumentDoc> {
    Object.assign(repository, data);
    return await this._documentRepo.save(repository, options);
  }

  async active(
    repository: DocumentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<DocumentDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._documentRepo.save(repository, options);
  }

  async inactive(
    repository: DocumentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<DocumentDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._documentRepo.save(repository, options);
  }

  async delete(
    repository: DocumentDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<DocumentDoc> {
    return await this._documentRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: DocumentDoc,
    options?: IDatabaseManyOptions,
  ): Promise<DocumentDoc> {
    return await this._documentRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._documentRepo.exists(find, options);
  }

  async createMany(
    data: DocumentCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._documentRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._documentRepo.deleteMany(find, options);
  }

  async _checkDocument(id: string): Promise<DocumentDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'document.error.notFound',
      });
    }
    return doc;
  }
}
