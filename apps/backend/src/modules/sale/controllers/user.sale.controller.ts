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
  SALE_DEFAULT_AVAILABLE_ORDER_BY,
  SALE_DEFAULT_AVAILABLE_SEARCH,
  SALE_DEFAULT_ORDER_BY,
  SALE_DEFAULT_ORDER_DIRECTION,
  SALE_DEFAULT_PER_PAGE,
} from '../constants/sale.list.constant';
import {
  SaleActiveDoc,
  SaleCreateDoc,
  SaleDeleteDoc,
  SaleGetDoc,
  SaleInactiveDoc,
  SaleListDoc,
  SaleUpdateDoc,
} from '../docs/sale.doc';
import { SaleCreateDto } from '../dtos/sale.create.dto';
import { SaleRequestDto } from '../dtos/sale.request.dto';
import { SaleUpdateDto } from '../dtos/sale.update.dto';
import { ISaleEntity } from '../interfaces/sale.entity.interface';
import { SaleDoc } from '../repository/entities/sale.entity';
import { SaleGetSerialization } from '../serializations/sale.get.serialization';
import { SaleListSerialization } from '../serializations/sale.list.serialization';
import { SaleService } from '../services/sale.service';

@ApiTags('Sale')
@Controller({ version: '1', path: '/sale' })
export class UserSaleController {
  constructor(
    private readonly _saleService: SaleService,
    private readonly paginationService: PaginationService,
  ) {}

  @SaleListDoc()
  @ResponsePaging('sale.list', {
    serialization: SaleListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      SALE_DEFAULT_PER_PAGE,
      SALE_DEFAULT_ORDER_BY,
      SALE_DEFAULT_ORDER_DIRECTION,
      SALE_DEFAULT_AVAILABLE_SEARCH,
      SALE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: ISaleEntity[] = await this._saleService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._saleService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @SaleGetDoc()
  @ResponseSingle('sale.get', {
    serialization: SaleGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(SaleRequestDto)
  @Get('/get/:sale')
  async get(@Param('sale') id: string): Promise<IResponse> {
    const doc = await this._saleService._checkSale(id);
    return { data: doc };
  }

  @SaleCreateDoc()
  @ResponseSingle('sale.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: SaleCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: SaleDoc = await this._saleService.create(data);
    return {
      data: doc?._id,
    };
  }

  @SaleUpdateDoc()
  @ResponseSingle('sale.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(SaleRequestDto)
  @Patch('/update/:sale')
  async update(
    @Param('sale') id: string,
    @Body()
    body: SaleUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._saleService._checkSale(id);
    await this._saleService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @SaleInactiveDoc()
  @ResponseSingle('sale.inactive')
  @UserProtected()
  @RequestParamGuard(SaleRequestDto)
  @Patch('/update/inactive/:sale')
  async inactive(@Param('sale') id: string): Promise<IResponse> {
    const doc = await this._saleService._checkSale(id);
    await this._saleService.inactive(doc);
    return { data: doc?._id };
  }

  @SaleActiveDoc()
  @ResponseSingle('sale.active')
  @UserProtected()
  @RequestParamGuard(SaleRequestDto)
  @Patch('/update/active/:sale')
  async active(@Param('sale') id: string): Promise<IResponse> {
    const doc = await this._saleService._checkSale(id);
    await this._saleService.active(doc);
    return { data: doc?._id };
  }

  @SaleDeleteDoc()
  @ResponseSingle('sale.delete')
  @UserProtected()
  @RequestParamGuard(SaleRequestDto)
  @Delete('/delete/:sale')
  async delete(@Param('sale') id: string): Promise<IResponse> {
    const doc = await this._saleService._checkSale(id);
    await this._saleService.delete(doc);
    return { data: doc?._id };
  }
}
