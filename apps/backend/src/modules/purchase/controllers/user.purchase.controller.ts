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
  PURCHASE_DEFAULT_AVAILABLE_ORDER_BY,
  PURCHASE_DEFAULT_AVAILABLE_SEARCH,
  PURCHASE_DEFAULT_ORDER_BY,
  PURCHASE_DEFAULT_ORDER_DIRECTION,
  PURCHASE_DEFAULT_PER_PAGE,
} from '../constants/purchase.list.constant';
import {
  PurchaseActiveDoc,
  PurchaseCreateDoc,
  PurchaseDeleteDoc,
  PurchaseGetDoc,
  PurchaseInactiveDoc,
  PurchaseListDoc,
  PurchaseUpdateDoc,
} from '../docs/purchase.doc';
import { PurchaseCreateDto } from '../dtos/purchase.create.dto';
import { PurchaseRequestDto } from '../dtos/purchase.request.dto';
import { PurchaseUpdateDto } from '../dtos/purchase.update.dto';
import { IPurchaseEntity } from '../interfaces/purchase.entity.interface';
import { PurchaseDoc } from '../repository/entities/purchase.entity';
import { PurchaseGetSerialization } from '../serializations/purchase.get.serialization';
import { PurchaseListSerialization } from '../serializations/purchase.list.serialization';
import { PurchaseService } from '../services/purchase.service';

@ApiTags('Purchase')
@Controller({ version: '1', path: '/purchase' })
export class UserPurchaseController {
  constructor(
    private readonly _purchaseService: PurchaseService,
    private readonly paginationService: PaginationService,
  ) {}

  @PurchaseListDoc()
  @ResponsePaging('purchase.list', {
    serialization: PurchaseListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      PURCHASE_DEFAULT_PER_PAGE,
      PURCHASE_DEFAULT_ORDER_BY,
      PURCHASE_DEFAULT_ORDER_DIRECTION,
      PURCHASE_DEFAULT_AVAILABLE_SEARCH,
      PURCHASE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: IPurchaseEntity[] = await this._purchaseService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._purchaseService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @PurchaseGetDoc()
  @ResponseSingle('purchase.get', {
    serialization: PurchaseGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(PurchaseRequestDto)
  @Get('/get/:purchase')
  async get(@Param('purchase') id: string): Promise<IResponse> {
    const doc = await this._purchaseService._checkPurchase(id);
    return { data: doc };
  }

  @PurchaseCreateDoc()
  @ResponseSingle('purchase.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: PurchaseCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: PurchaseDoc = await this._purchaseService.create(data);
    return {
      data: doc?._id,
    };
  }

  @PurchaseUpdateDoc()
  @ResponseSingle('purchase.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(PurchaseRequestDto)
  @Patch('/update/:purchase')
  async update(
    @Param('purchase') id: string,
    @Body()
    body: PurchaseUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._purchaseService._checkPurchase(id);
    await this._purchaseService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @PurchaseInactiveDoc()
  @ResponseSingle('purchase.inactive')
  @UserProtected()
  @RequestParamGuard(PurchaseRequestDto)
  @Patch('/update/inactive/:purchase')
  async inactive(@Param('purchase') id: string): Promise<IResponse> {
    const doc = await this._purchaseService._checkPurchase(id);
    await this._purchaseService.inactive(doc);
    return { data: doc?._id };
  }

  @PurchaseActiveDoc()
  @ResponseSingle('purchase.active')
  @UserProtected()
  @RequestParamGuard(PurchaseRequestDto)
  @Patch('/update/active/:purchase')
  async active(@Param('purchase') id: string): Promise<IResponse> {
    const doc = await this._purchaseService._checkPurchase(id);
    await this._purchaseService.active(doc);
    return { data: doc?._id };
  }

  @PurchaseDeleteDoc()
  @ResponseSingle('purchase.delete')
  @UserProtected()
  @RequestParamGuard(PurchaseRequestDto)
  @Delete('/delete/:purchase')
  async delete(@Param('purchase') id: string): Promise<IResponse> {
    const doc = await this._purchaseService._checkPurchase(id);
    await this._purchaseService.delete(doc);
    return { data: doc?._id };
  }
}
