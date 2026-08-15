import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
  ResponsePaging,
  ResponseSingle,
} from 'src/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import {
  BATCH_DEFAULT_AVAILABLE_ORDER_BY,
  BATCH_DEFAULT_AVAILABLE_SEARCH,
  BATCH_DEFAULT_ORDER_BY,
  BATCH_DEFAULT_ORDER_DIRECTION,
  BATCH_DEFAULT_PER_PAGE,
} from '../constants/batch.list.constant';
import {
  BatchActiveDoc,
  BatchCreateDoc,
  BatchDeleteDoc,
  BatchGetDoc,
  BatchInactiveDoc,
  BatchListDoc,
  BatchUpdateDoc,
} from '../docs/batch.doc';
import { BatchCreateDto } from '../dtos/batch.create.dto';
import { BatchRequestDto } from '../dtos/batch.request.dto';
import { BatchUpdateDto } from '../dtos/batch.update.dto';
import { IBatchEntity } from '../interfaces/batch.entity.interface';
import { BatchDoc } from '../repository/entities/batch.entity';
import { BatchGetSerialization } from '../serializations/batch.get.serialization';
import { BatchListSerialization } from '../serializations/batch.list.serialization';
import { BatchService } from '../services/batch.service';

@ApiTags('Batch')
@Controller({ version: '1', path: '/batch' })
export class AdminBatchController {
  constructor(
    private readonly _batchService: BatchService,
    private readonly paginationService: PaginationService,
  ) {}

  @BatchListDoc()
  @ResponsePaging('batch.list', {
    serialization: BatchListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      BATCH_DEFAULT_PER_PAGE,
      BATCH_DEFAULT_ORDER_BY,
      BATCH_DEFAULT_ORDER_DIRECTION,
      BATCH_DEFAULT_AVAILABLE_SEARCH,
      BATCH_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: IBatchEntity[] = await this._batchService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._batchService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @BatchGetDoc()
  @ResponseSingle('batch.get', {
    serialization: BatchGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(BatchRequestDto)
  @Get('/get/:batch')
  async get(@Param('batch') id: string): Promise<IResponse> {
    const doc = await this._batchService._checkBatch(id);
    return { data: doc };
  }

  @BatchCreateDoc()
  @ResponseSingle('batch.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: BatchCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: BatchDoc = await this._batchService.create(data);
    return {
      data: doc?._id,
    };
  }

  @BatchUpdateDoc()
  @ResponseSingle('batch.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(BatchRequestDto)
  @Patch('/update/:batch')
  async update(
    @Param('batch') id: string,
    @Body()
    body: BatchUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._batchService._checkBatch(id);
    await this._batchService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @BatchInactiveDoc()
  @ResponseSingle('batch.inactive')
  @AdminProtected()
  @RequestParamGuard(BatchRequestDto)
  @Patch('/update/inactive/:batch')
  async inactive(@Param('batch') id: string): Promise<IResponse> {
    const doc = await this._batchService._checkBatch(id);
    await this._batchService.inactive(doc);
    return { data: doc?._id };
  }

  @BatchActiveDoc()
  @ResponseSingle('batch.active')
  @AdminProtected()
  @RequestParamGuard(BatchRequestDto)
  @Patch('/update/active/:batch')
  async active(@Param('batch') id: string): Promise<IResponse> {
    const doc = await this._batchService._checkBatch(id);
    await this._batchService.active(doc);
    return { data: doc?._id };
  }

  @BatchDeleteDoc()
  @ResponseSingle('batch.delete')
  @AdminProtected()
  @RequestParamGuard(BatchRequestDto)
  @Delete('/delete/:batch')
  async delete(@Param('batch') id: string): Promise<IResponse> {
    const doc = await this._batchService._checkBatch(id);
    await this._batchService.delete(doc);
    return { data: doc?._id };
  }
}
