import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ClientSession } from 'mongoose';
import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { ENUM_FILE_STATUS_CODE_ERROR } from 'src/common/file/constants/file.status-code.constant';
import { IFile } from 'src/common/file/interfaces/file.interface';
import { HelperFileService } from 'src/common/helper/services/helper.file.service';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import {
  ProductDoc,
  ProductEntity,
} from '../repository/entities/product.entity';
import { ProductRepository } from '../repository/repositories/product.repository';
import {
  isSpreadsheetFile,
  mapImportRow,
  PRODUCT_IMPORT_MAX_ROWS,
  ProductImportResult,
} from '../utils/product-import.util';

@Injectable()
export class ProductService {
  constructor(
    private readonly _productRepo: ProductRepository,
    private readonly helperFileService: HelperFileService,
  ) {}

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

  async importFromFile(
    file: IFile,
    tenantId: string,
  ): Promise<ProductImportResult> {
    if (!tenantId) {
      throw new BadRequestException({
        message: 'product.error.tenantIdRequired',
      });
    }
    if (!file?.buffer || !isSpreadsheetFile(file.originalname, file.mimetype)) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: 'file.error.mimeInvalid',
      });
    }

    let sheets: Record<string, unknown>[][];
    try {
      sheets = this.helperFileService.readExcelFromBuffer(file.buffer) as Record<
        string,
        unknown
      >[][];
    } catch {
      throw new BadRequestException({
        message: 'product.error.importInvalid',
      });
    }
    const rows = sheets[0] || [];
    if (!rows.length) {
      throw new BadRequestException({
        message: 'product.error.importEmpty',
      });
    }
    if (rows.length > PRODUCT_IMPORT_MAX_ROWS) {
      throw new BadRequestException({
        message: 'product.error.importTooLarge',
      });
    }

    return this.importFromRows(rows, tenantId);
  }

  async importFromRows(
    rows: Record<string, unknown>[],
    tenantId: string,
  ): Promise<ProductImportResult> {
    const result: ProductImportResult = {
      created: 0,
      skipped: 0,
      errors: [],
    };
    const seenSkus = new Set<string>();
    const toCreate: ProductCreateDto[] = [];

    for (let index = 0; index < rows.length; index++) {
      const excelRow = index + 2;
      const mapped = mapImportRow(rows[index], tenantId);
      if (mapped.error || !mapped.dto) {
        result.skipped += 1;
        result.errors.push({
          row: excelRow,
          reason: mapped.error || 'Invalid row',
        });
        continue;
      }

      const skuKey = mapped.dto.sku.toLowerCase();
      if (seenSkus.has(skuKey)) {
        result.skipped += 1;
        result.errors.push({
          row: excelRow,
          sku: mapped.dto.sku,
          reason: 'Duplicate SKU in file',
        });
        continue;
      }
      seenSkus.add(skuKey);
      toCreate.push(mapped.dto);
    }

    if (!toCreate.length) {
      return result;
    }

    const existing = await this.findAll(
      { tenantId },
      { select: { sku: 1 } },
    );
    const existingSkus = new Set(
      existing.map((item) => String(item.sku).toLowerCase()),
    );
    const uniqueCreates: ProductCreateDto[] = [];

    for (const item of toCreate) {
      if (existingSkus.has(item.sku.toLowerCase())) {
        result.skipped += 1;
        result.errors.push({
          row: 0,
          sku: item.sku,
          reason: 'SKU already exists',
        });
        continue;
      }
      uniqueCreates.push(item);
    }

    if (uniqueCreates.length) {
      await this.createMany(uniqueCreates);
      result.created = uniqueCreates.length;
    }

    return result;
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
