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
  HELD_SALE_DEFAULT_AVAILABLE_ORDER_BY,
  HELD_SALE_DEFAULT_AVAILABLE_SEARCH,
  HELD_SALE_DEFAULT_ORDER_BY,
  HELD_SALE_DEFAULT_ORDER_DIRECTION,
  HELD_SALE_DEFAULT_PER_PAGE,
} from '../constants/held-sale.list.constant';
import {
  HeldSaleActiveDoc,
  HeldSaleCreateDoc,
  HeldSaleDeleteDoc,
  HeldSaleGetDoc,
  HeldSaleInactiveDoc,
  HeldSaleListDoc,
  HeldSaleUpdateDoc,
} from '../docs/held-sale.doc';
import { HeldSaleCreateDto } from '../dtos/held-sale.create.dto';
import { HeldSaleRequestDto } from '../dtos/held-sale.request.dto';
import { HeldSaleUpdateDto } from '../dtos/held-sale.update.dto';
import { IHeldSaleEntity } from '../interfaces/held-sale.entity.interface';
import { HeldSaleDoc } from '../repository/entities/held-sale.entity';
import { HeldSaleGetSerialization } from '../serializations/held-sale.get.serialization';
import { HeldSaleListSerialization } from '../serializations/held-sale.list.serialization';
import { HeldSaleService } from '../services/held-sale.service';

@ApiTags('HeldSale')
@Controller({ version: '1', path: '/held-sale' })
export class UserHeldSaleController {
  constructor(
    private readonly _heldSaleService: HeldSaleService,
    private readonly paginationService: PaginationService,
  ) {}

  @HeldSaleListDoc()
  @ResponsePaging('heldSale.list', {
    serialization: HeldSaleListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      HELD_SALE_DEFAULT_PER_PAGE,
      HELD_SALE_DEFAULT_ORDER_BY,
      HELD_SALE_DEFAULT_ORDER_DIRECTION,
      HELD_SALE_DEFAULT_AVAILABLE_SEARCH,
      HELD_SALE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: IHeldSaleEntity[] = await this._heldSaleService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._heldSaleService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @HeldSaleGetDoc()
  @ResponseSingle('heldSale.get', {
    serialization: HeldSaleGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(HeldSaleRequestDto)
  @Get('/get/:heldSale')
  async get(@Param('heldSale') id: string): Promise<IResponse> {
    const doc = await this._heldSaleService._checkHeldSale(id);
    return { data: doc };
  }

  @HeldSaleCreateDoc()
  @ResponseSingle('heldSale.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: HeldSaleCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: HeldSaleDoc = await this._heldSaleService.create(data);
    return {
      data: doc?._id,
    };
  }

  @HeldSaleUpdateDoc()
  @ResponseSingle('heldSale.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(HeldSaleRequestDto)
  @Patch('/update/:heldSale')
  async update(
    @Param('heldSale') id: string,
    @Body()
    body: HeldSaleUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._heldSaleService._checkHeldSale(id);
    await this._heldSaleService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @HeldSaleInactiveDoc()
  @ResponseSingle('heldSale.inactive')
  @UserProtected()
  @RequestParamGuard(HeldSaleRequestDto)
  @Patch('/update/inactive/:heldSale')
  async inactive(@Param('heldSale') id: string): Promise<IResponse> {
    const doc = await this._heldSaleService._checkHeldSale(id);
    await this._heldSaleService.inactive(doc);
    return { data: doc?._id };
  }

  @HeldSaleActiveDoc()
  @ResponseSingle('heldSale.active')
  @UserProtected()
  @RequestParamGuard(HeldSaleRequestDto)
  @Patch('/update/active/:heldSale')
  async active(@Param('heldSale') id: string): Promise<IResponse> {
    const doc = await this._heldSaleService._checkHeldSale(id);
    await this._heldSaleService.active(doc);
    return { data: doc?._id };
  }

  @HeldSaleDeleteDoc()
  @ResponseSingle('heldSale.delete')
  @UserProtected()
  @RequestParamGuard(HeldSaleRequestDto)
  @Delete('/delete/:heldSale')
  async delete(@Param('heldSale') id: string): Promise<IResponse> {
    const doc = await this._heldSaleService._checkHeldSale(id);
    await this._heldSaleService.delete(doc);
    return { data: doc?._id };
  }
}
