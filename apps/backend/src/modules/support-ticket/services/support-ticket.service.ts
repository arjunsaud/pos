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
import { SupportTicketCreateDto } from '../dtos/support-ticket.create.dto';
import { SupportTicketUpdateDto } from '../dtos/support-ticket.update.dto';
import {
  SupportTicketDoc,
  SupportTicketEntity,
} from '../repository/entities/support-ticket.entity';
import { SupportTicketRepository } from '../repository/repositories/support-ticket.repository';

@Injectable()
export class SupportTicketService {
  constructor(private readonly _supportTicketRepo: SupportTicketRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<SupportTicketEntity[]> {
    return await this._supportTicketRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SupportTicketDoc> {
    return await this._supportTicketRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<SupportTicketDoc> {
    return await this._supportTicketRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._supportTicketRepo.getTotal(find, options);
  }

  async create(
    data: SupportTicketCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<SupportTicketDoc> {
    const entity = new SupportTicketEntity();
    Object.assign(entity, data);
    return await this._supportTicketRepo.create(entity, options);
  }

  async update(
    repository: SupportTicketDoc,
    data: SupportTicketUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<SupportTicketDoc> {
    Object.assign(repository, data);
    return await this._supportTicketRepo.save(repository, options);
  }

  async active(
    repository: SupportTicketDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SupportTicketDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = true;
    }
    if ('status' in repository) {
      (repository as any).status = 'active';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = true;
    }
    return await this._supportTicketRepo.save(repository, options);
  }

  async inactive(
    repository: SupportTicketDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SupportTicketDoc> {
    if ('isActive' in repository) {
      (repository as any).isActive = false;
    }
    if ('status' in repository) {
      (repository as any).status = 'inactive';
    }
    if ('enabled' in repository) {
      (repository as any).enabled = false;
    }
    return await this._supportTicketRepo.save(repository, options);
  }

  async delete(
    repository: SupportTicketDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<SupportTicketDoc> {
    return await this._supportTicketRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: SupportTicketDoc,
    options?: IDatabaseManyOptions,
  ): Promise<SupportTicketDoc> {
    return await this._supportTicketRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._supportTicketRepo.exists(find, options);
  }

  async createMany(
    data: SupportTicketCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._supportTicketRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._supportTicketRepo.deleteMany(find, options);
  }

  async _checkSupportTicket(id: string): Promise<SupportTicketDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'supportTicket.error.notFound',
      });
    }
    return doc;
  }
}
