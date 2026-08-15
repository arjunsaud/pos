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
  OUTLET_DEFAULT_AVAILABLE_ORDER_BY,
  OUTLET_DEFAULT_AVAILABLE_SEARCH,
  OUTLET_DEFAULT_ORDER_BY,
  OUTLET_DEFAULT_ORDER_DIRECTION,
  OUTLET_DEFAULT_PER_PAGE,
} from '../constants/outlet.list.constant';
import {
  OutletActiveDoc,
  OutletCreateDoc,
  OutletDeleteDoc,
  OutletGetDoc,
  OutletInactiveDoc,
  OutletListDoc,
  OutletUpdateDoc,
} from '../docs/outlet.doc';
import { OutletCreateDto } from '../dtos/outlet.create.dto';
import { OutletRequestDto } from '../dtos/outlet.request.dto';
import { OutletUpdateDto } from '../dtos/outlet.update.dto';
import { IOutletEntity } from '../interfaces/outlet.entity.interface';
import { OutletDoc } from '../repository/entities/outlet.entity';
import { OutletGetSerialization } from '../serializations/outlet.get.serialization';
import { OutletListSerialization } from '../serializations/outlet.list.serialization';
import { OutletService } from '../services/outlet.service';

@ApiTags('Outlet')
@Controller({ version: '1', path: '/outlet' })
export class UserOutletController {
  constructor(
    private readonly _outletService: OutletService,
    private readonly paginationService: PaginationService,
  ) {}

  @OutletListDoc()
  @ResponsePaging('outlet.list', {
    serialization: OutletListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      OUTLET_DEFAULT_PER_PAGE,
      OUTLET_DEFAULT_ORDER_BY,
      OUTLET_DEFAULT_ORDER_DIRECTION,
      OUTLET_DEFAULT_AVAILABLE_SEARCH,
      OUTLET_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: IOutletEntity[] = await this._outletService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._outletService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @OutletGetDoc()
  @ResponseSingle('outlet.get', {
    serialization: OutletGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(OutletRequestDto)
  @Get('/get/:outlet')
  async get(@Param('outlet') id: string): Promise<IResponse> {
    const doc = await this._outletService._checkOutlet(id);
    return { data: doc };
  }

  @OutletCreateDoc()
  @ResponseSingle('outlet.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: OutletCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: OutletDoc = await this._outletService.create(data);
    return {
      data: doc?._id,
    };
  }

  @OutletUpdateDoc()
  @ResponseSingle('outlet.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(OutletRequestDto)
  @Patch('/update/:outlet')
  async update(
    @Param('outlet') id: string,
    @Body()
    body: OutletUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._outletService._checkOutlet(id);
    await this._outletService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @OutletInactiveDoc()
  @ResponseSingle('outlet.inactive')
  @UserProtected()
  @RequestParamGuard(OutletRequestDto)
  @Patch('/update/inactive/:outlet')
  async inactive(@Param('outlet') id: string): Promise<IResponse> {
    const doc = await this._outletService._checkOutlet(id);
    await this._outletService.inactive(doc);
    return { data: doc?._id };
  }

  @OutletActiveDoc()
  @ResponseSingle('outlet.active')
  @UserProtected()
  @RequestParamGuard(OutletRequestDto)
  @Patch('/update/active/:outlet')
  async active(@Param('outlet') id: string): Promise<IResponse> {
    const doc = await this._outletService._checkOutlet(id);
    await this._outletService.active(doc);
    return { data: doc?._id };
  }

  @OutletDeleteDoc()
  @ResponseSingle('outlet.delete')
  @UserProtected()
  @RequestParamGuard(OutletRequestDto)
  @Delete('/delete/:outlet')
  async delete(@Param('outlet') id: string): Promise<IResponse> {
    const doc = await this._outletService._checkOutlet(id);
    await this._outletService.delete(doc);
    return { data: doc?._id };
  }
}
