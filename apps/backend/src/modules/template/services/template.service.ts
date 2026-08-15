import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import {
  DEFAULT_INVOICE_HTML,
  DEFAULT_RECEIPT_HTML,
  PrintTemplateType,
} from '@posnepal/shared';
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { TemplateCreateDto } from '../dtos/template.create.dto';
import { TemplateUpdateDto } from '../dtos/template.update.dto';
import {
  TemplateDoc,
  TemplateEntity,
} from '../repository/entities/template.entity';
import { TemplateRepository } from '../repository/repositories/template.repository';

@Injectable()
export class TemplateService {
  constructor(private readonly _templateRepo: TemplateRepository) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<TemplateEntity[]> {
    return await this._templateRepo.findAll(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<TemplateDoc> {
    return await this._templateRepo.findOneById(_id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<TemplateDoc> {
    return await this._templateRepo.findOne(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return await this._templateRepo.getTotal(find, options);
  }

  async create(
    data: TemplateCreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<TemplateDoc> {
    const entity = new TemplateEntity();
    entity.type = data.type;
    entity.name = data.name;
    entity.html = data.html;
    entity.paperSize = data.paperSize || (data.type === 'receipt' ? '80mm' : 'a4');
    entity.isDefault = data.isDefault ?? false;
    entity.isActive = data.isActive ?? true;
    const created = await this._templateRepo.create(entity, options);
    if (created.isDefault) {
      await this.clearOtherDefaults(created.type, String(created._id));
    }
    return created;
  }

  async update(
    repository: TemplateDoc,
    data: TemplateUpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<TemplateDoc> {
    Object.assign(repository, data);
    const saved = await this._templateRepo.save(repository, options);
    if (saved.isDefault) {
      await this.clearOtherDefaults(saved.type, String(saved._id));
    }
    return saved;
  }

  async active(
    repository: TemplateDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<TemplateDoc> {
    repository.isActive = true;
    return await this._templateRepo.save(repository, options);
  }

  async inactive(
    repository: TemplateDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<TemplateDoc> {
    repository.isActive = false;
    return await this._templateRepo.save(repository, options);
  }

  async delete(
    repository: TemplateDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<TemplateDoc> {
    return await this._templateRepo.softDelete(repository, options);
  }

  async deleteForce(
    repository: TemplateDoc,
    options?: IDatabaseManyOptions,
  ): Promise<TemplateDoc> {
    return await this._templateRepo.delete(repository, options);
  }

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return await this._templateRepo.exists(find, options);
  }

  async createMany(
    data: TemplateCreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {
    return await this._templateRepo.createMany(data, options);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {
    return await this._templateRepo.deleteMany(find, options);
  }

  async _checkTemplate(id: string): Promise<TemplateDoc> {
    const doc = await this.findOneById(id);
    if (!doc) {
      throw new NotFoundException({
        message: 'template.error.notFound',
      });
    }
    return doc;
  }

  async ensureDefaults(): Promise<void> {
    const [invoiceCount, receiptCount] = await Promise.all([
      this.getTotal({ type: 'invoice' }),
      this.getTotal({ type: 'receipt' }),
    ]);
    if (invoiceCount === 0) {
      await this.create({
        type: 'invoice',
        name: 'Default tax invoice',
        html: DEFAULT_INVOICE_HTML,
        paperSize: 'a4',
        isDefault: true,
        isActive: true,
      });
    }
    if (receiptCount === 0) {
      await this.create({
        type: 'receipt',
        name: 'Default POS receipt',
        html: DEFAULT_RECEIPT_HTML,
        paperSize: '80mm',
        isDefault: true,
        isActive: true,
      });
    }
  }

  async findActiveByType(type: PrintTemplateType): Promise<TemplateDoc | null> {
    await this.ensureDefaults();
    const preferred = await this.findOne({
      type,
      isActive: true,
      isDefault: true,
    });
    if (preferred) return preferred;
    return this.findOne({ type, isActive: true });
  }

  private async clearOtherDefaults(type: string, keepId: string): Promise<void> {
    const others = await this.findAll({
      type,
      isDefault: true,
      _id: { $ne: keepId },
    });
    await Promise.all(
      others.map(async (row) => {
        const doc = await this.findOneById(String(row._id));
        if (!doc) return;
        doc.isDefault = false;
        await this._templateRepo.save(doc);
      }),
    );
  }
}
