import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { PAGINATION_MAX_PAGE } from 'src/common/pagination/constants/pagination.constant';
import { MailLogDoc, MailLogEntity } from '../entities/mail-log.entities';
import { MailLogRepository } from '../repository/mail-log.repository';

@Injectable()
export class MailLogService {
  constructor(private readonly mailLogRepo: MailLogRepository) {}

  async create(
    data: Partial<MailLogEntity>,
    session?: ClientSession,
  ): Promise<MailLogDoc> {
    try {
      const newBanner = await this.mailLogRepo.create(data, { session });
      return newBanner;
    } catch (error) {
      throw error;
    }
  }
  async createMany(
    data: Partial<MailLogEntity>[],
    session?: ClientSession,
  ): Promise<boolean> {
    try {
      const newBanner = await this.mailLogRepo.createMany(data, { session });
      return newBanner;
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    find?: Record<string, unknown>,
    options?: IDatabaseFindAllOptions,
  ): Promise<MailLogDoc[]> {
    return this.mailLogRepo.findAll<MailLogDoc>(find, {
      ...options,
    });
  }

  async findOneById<T>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const data = await this.mailLogRepo.findOneById<T>(_id, options);
    return data;
  }

  async getTotal(
    find?: Record<string, unknown>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.mailLogRepo.getTotal(find, {
      ...options,
    });
  }

  totalPage(totalData: number, perPage: number): number {
    let totalPage = Math.ceil(totalData / perPage);
    totalPage = totalPage === 0 ? 1 : totalPage;
    return totalPage > PAGINATION_MAX_PAGE ? PAGINATION_MAX_PAGE : totalPage;
  }

  async update(
    mailLogRepo: MailLogDoc,
    data: Partial<MailLogDoc>,
    session?: ClientSession,
    options?: IDatabaseSaveOptions,
  ): Promise<MailLogDoc> {
    Object.assign(mailLogRepo, data);
    return this.mailLogRepo.save(mailLogRepo, { ...options, session });
  }

  async softDelete(
    mailLogRepo: MailLogDoc,
    session?: ClientSession,
    options?: IDatabaseSaveOptions,
  ): Promise<MailLogDoc> {
    return this.mailLogRepo.softDelete(mailLogRepo, { ...options, session });
  }

  async delete(
    mailLogRepo: MailLogDoc,
    session?: ClientSession,
    options?: IDatabaseSaveOptions,
  ): Promise<MailLogDoc> {
    return this.mailLogRepo.delete(mailLogRepo, { ...options, session });
  }

  async deleteForce(
    repository: MailLogDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<MailLogDoc> {
    return await this.mailLogRepo.delete(repository, options);
  }
}
