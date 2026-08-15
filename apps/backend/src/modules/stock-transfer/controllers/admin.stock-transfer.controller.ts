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
  STOCK_TRANSFER_DEFAULT_AVAILABLE_ORDER_BY,
  STOCK_TRANSFER_DEFAULT_AVAILABLE_SEARCH,
  STOCK_TRANSFER_DEFAULT_ORDER_BY,
  STOCK_TRANSFER_DEFAULT_ORDER_DIRECTION,
  STOCK_TRANSFER_DEFAULT_PER_PAGE,
} from '../constants/stock-transfer.list.constant';
import {
  StockTransferActiveDoc,
  StockTransferCreateDoc,
  StockTransferDeleteDoc,
  StockTransferGetDoc,
  StockTransferInactiveDoc,
  StockTransferListDoc,
  StockTransferUpdateDoc,
} from '../docs/stock-transfer.doc';
import { StockTransferCreateDto } from '../dtos/stock-transfer.create.dto';
import { StockTransferRequestDto } from '../dtos/stock-transfer.request.dto';
import { StockTransferUpdateDto } from '../dtos/stock-transfer.update.dto';
import { IStockTransferEntity } from '../interfaces/stock-transfer.entity.interface';
import { StockTransferDoc } from '../repository/entities/stock-transfer.entity';
import { StockTransferGetSerialization } from '../serializations/stock-transfer.get.serialization';
import { StockTransferListSerialization } from '../serializations/stock-transfer.list.serialization';
import { StockTransferService } from '../services/stock-transfer.service';

@ApiTags('StockTransfer')
@Controller({ version: '1', path: '/stock-transfer' })
export class AdminStockTransferController {
  constructor(
    private readonly _stockTransferService: StockTransferService,
    private readonly paginationService: PaginationService,
  ) {}

  @StockTransferListDoc()
  @ResponsePaging('stockTransfer.list', {
    serialization: StockTransferListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      STOCK_TRANSFER_DEFAULT_PER_PAGE,
      STOCK_TRANSFER_DEFAULT_ORDER_BY,
      STOCK_TRANSFER_DEFAULT_ORDER_DIRECTION,
      STOCK_TRANSFER_DEFAULT_AVAILABLE_SEARCH,
      STOCK_TRANSFER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: IStockTransferEntity[] = await this._stockTransferService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._stockTransferService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @StockTransferGetDoc()
  @ResponseSingle('stockTransfer.get', {
    serialization: StockTransferGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(StockTransferRequestDto)
  @Get('/get/:stockTransfer')
  async get(@Param('stockTransfer') id: string): Promise<IResponse> {
    const doc = await this._stockTransferService._checkStockTransfer(id);
    return { data: doc };
  }

  @StockTransferCreateDoc()
  @ResponseSingle('stockTransfer.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: StockTransferCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: StockTransferDoc = await this._stockTransferService.create(data);
    return {
      data: doc?._id,
    };
  }

  @StockTransferUpdateDoc()
  @ResponseSingle('stockTransfer.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(StockTransferRequestDto)
  @Patch('/update/:stockTransfer')
  async update(
    @Param('stockTransfer') id: string,
    @Body()
    body: StockTransferUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._stockTransferService._checkStockTransfer(id);
    await this._stockTransferService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @StockTransferInactiveDoc()
  @ResponseSingle('stockTransfer.inactive')
  @AdminProtected()
  @RequestParamGuard(StockTransferRequestDto)
  @Patch('/update/inactive/:stockTransfer')
  async inactive(@Param('stockTransfer') id: string): Promise<IResponse> {
    const doc = await this._stockTransferService._checkStockTransfer(id);
    await this._stockTransferService.inactive(doc);
    return { data: doc?._id };
  }

  @StockTransferActiveDoc()
  @ResponseSingle('stockTransfer.active')
  @AdminProtected()
  @RequestParamGuard(StockTransferRequestDto)
  @Patch('/update/active/:stockTransfer')
  async active(@Param('stockTransfer') id: string): Promise<IResponse> {
    const doc = await this._stockTransferService._checkStockTransfer(id);
    await this._stockTransferService.active(doc);
    return { data: doc?._id };
  }

  @StockTransferDeleteDoc()
  @ResponseSingle('stockTransfer.delete')
  @AdminProtected()
  @RequestParamGuard(StockTransferRequestDto)
  @Delete('/delete/:stockTransfer')
  async delete(@Param('stockTransfer') id: string): Promise<IResponse> {
    const doc = await this._stockTransferService._checkStockTransfer(id);
    await this._stockTransferService.delete(doc);
    return { data: doc?._id };
  }
}
