import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { GetUser, UserProtected } from 'src/modules/user/decorators/user.decorator';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import {
  STOCK_MOVEMENT_DEFAULT_AVAILABLE_ORDER_BY,
  STOCK_MOVEMENT_DEFAULT_AVAILABLE_SEARCH,
  STOCK_MOVEMENT_DEFAULT_ORDER_BY,
  STOCK_MOVEMENT_DEFAULT_ORDER_DIRECTION,
  STOCK_MOVEMENT_DEFAULT_PER_PAGE,
} from '../constants/stock-movement.list.constant';
import {
  StockMovementActiveDoc,
  StockMovementCreateDoc,
  StockMovementDeleteDoc,
  StockMovementGetDoc,
  StockMovementInactiveDoc,
  StockMovementListDoc,
  StockMovementUpdateDoc,
} from '../docs/stock-movement.doc';
import { StockMovementCreateDto } from '../dtos/stock-movement.create.dto';
import { StockMovementRequestDto } from '../dtos/stock-movement.request.dto';
import { StockMovementUpdateDto } from '../dtos/stock-movement.update.dto';
import { IStockMovementEntity } from '../interfaces/stock-movement.entity.interface';
import { StockMovementDoc } from '../repository/entities/stock-movement.entity';
import { StockMovementGetSerialization } from '../serializations/stock-movement.get.serialization';
import { StockMovementListSerialization } from '../serializations/stock-movement.list.serialization';
import { StockMovementService } from '../services/stock-movement.service';

@ApiTags('StockMovement')
@Controller({ version: '1', path: '/stock-movement' })
export class UserStockMovementController {
  constructor(
    private readonly _stockMovementService: StockMovementService,
    private readonly paginationService: PaginationService,
  ) {}

  @StockMovementListDoc()
  @ResponsePaging('stockMovement.list', {
    serialization: StockMovementListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      STOCK_MOVEMENT_DEFAULT_PER_PAGE,
      STOCK_MOVEMENT_DEFAULT_ORDER_BY,
      STOCK_MOVEMENT_DEFAULT_ORDER_DIRECTION,
      STOCK_MOVEMENT_DEFAULT_AVAILABLE_SEARCH,
      STOCK_MOVEMENT_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: IStockMovementEntity[] = await this._stockMovementService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._stockMovementService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @StockMovementGetDoc()
  @ResponseSingle('stockMovement.get', {
    serialization: StockMovementGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(StockMovementRequestDto)
  @Get('/get/:stockMovement')
  async get(@Param('stockMovement') id: string): Promise<IResponse> {
    const doc = await this._stockMovementService._checkStockMovement(id);
    return { data: doc };
  }

  @StockMovementCreateDoc()
  @ResponseSingle('stockMovement.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: StockMovementCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: StockMovementDoc = await this._stockMovementService.create(data);
    return {
      data: doc?._id,
    };
  }

  @StockMovementUpdateDoc()
  @ResponseSingle('stockMovement.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(StockMovementRequestDto)
  @Patch('/update/:stockMovement')
  async update(
    @Param('stockMovement') id: string,
    @Body()
    body: StockMovementUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._stockMovementService._checkStockMovement(id);
    await this._stockMovementService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @StockMovementInactiveDoc()
  @ResponseSingle('stockMovement.inactive')
  @UserProtected()
  @RequestParamGuard(StockMovementRequestDto)
  @Patch('/update/inactive/:stockMovement')
  async inactive(@Param('stockMovement') id: string): Promise<IResponse> {
    const doc = await this._stockMovementService._checkStockMovement(id);
    await this._stockMovementService.inactive(doc);
    return { data: doc?._id };
  }

  @StockMovementActiveDoc()
  @ResponseSingle('stockMovement.active')
  @UserProtected()
  @RequestParamGuard(StockMovementRequestDto)
  @Patch('/update/active/:stockMovement')
  async active(@Param('stockMovement') id: string): Promise<IResponse> {
    const doc = await this._stockMovementService._checkStockMovement(id);
    await this._stockMovementService.active(doc);
    return { data: doc?._id };
  }

  @StockMovementDeleteDoc()
  @ResponseSingle('stockMovement.delete')
  @UserProtected()
  @RequestParamGuard(StockMovementRequestDto)
  @Delete('/delete/:stockMovement')
  async delete(@Param('stockMovement') id: string): Promise<IResponse> {
    const doc = await this._stockMovementService._checkStockMovement(id);
    await this._stockMovementService.delete(doc);
    return { data: doc?._id };
  }
}
