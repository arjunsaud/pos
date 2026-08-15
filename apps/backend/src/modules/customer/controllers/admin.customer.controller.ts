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
  CUSTOMER_DEFAULT_AVAILABLE_ORDER_BY,
  CUSTOMER_DEFAULT_AVAILABLE_SEARCH,
  CUSTOMER_DEFAULT_ORDER_BY,
  CUSTOMER_DEFAULT_ORDER_DIRECTION,
  CUSTOMER_DEFAULT_PER_PAGE,
} from '../constants/customer.list.constant';
import {
  CustomerActiveDoc,
  CustomerCreateDoc,
  CustomerDeleteDoc,
  CustomerGetDoc,
  CustomerInactiveDoc,
  CustomerListDoc,
  CustomerUpdateDoc,
} from '../docs/customer.doc';
import { CustomerCreateDto } from '../dtos/customer.create.dto';
import { CustomerRequestDto } from '../dtos/customer.request.dto';
import { CustomerUpdateDto } from '../dtos/customer.update.dto';
import { ICustomerEntity } from '../interfaces/customer.entity.interface';
import { CustomerDoc } from '../repository/entities/customer.entity';
import { CustomerGetSerialization } from '../serializations/customer.get.serialization';
import { CustomerListSerialization } from '../serializations/customer.list.serialization';
import { CustomerService } from '../services/customer.service';

@ApiTags('Customer')
@Controller({ version: '1', path: '/customer' })
export class AdminCustomerController {
  constructor(
    private readonly _customerService: CustomerService,
    private readonly paginationService: PaginationService,
  ) {}

  @CustomerListDoc()
  @ResponsePaging('customer.list', {
    serialization: CustomerListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      CUSTOMER_DEFAULT_PER_PAGE,
      CUSTOMER_DEFAULT_ORDER_BY,
      CUSTOMER_DEFAULT_ORDER_DIRECTION,
      CUSTOMER_DEFAULT_AVAILABLE_SEARCH,
      CUSTOMER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: ICustomerEntity[] = await this._customerService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._customerService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @CustomerGetDoc()
  @ResponseSingle('customer.get', {
    serialization: CustomerGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(CustomerRequestDto)
  @Get('/get/:customer')
  async get(@Param('customer') id: string): Promise<IResponse> {
    const doc = await this._customerService._checkCustomer(id);
    return { data: doc };
  }

  @CustomerCreateDoc()
  @ResponseSingle('customer.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: CustomerCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: CustomerDoc = await this._customerService.create(data);
    return {
      data: doc?._id,
    };
  }

  @CustomerUpdateDoc()
  @ResponseSingle('customer.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(CustomerRequestDto)
  @Patch('/update/:customer')
  async update(
    @Param('customer') id: string,
    @Body()
    body: CustomerUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._customerService._checkCustomer(id);
    await this._customerService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @CustomerInactiveDoc()
  @ResponseSingle('customer.inactive')
  @AdminProtected()
  @RequestParamGuard(CustomerRequestDto)
  @Patch('/update/inactive/:customer')
  async inactive(@Param('customer') id: string): Promise<IResponse> {
    const doc = await this._customerService._checkCustomer(id);
    await this._customerService.inactive(doc);
    return { data: doc?._id };
  }

  @CustomerActiveDoc()
  @ResponseSingle('customer.active')
  @AdminProtected()
  @RequestParamGuard(CustomerRequestDto)
  @Patch('/update/active/:customer')
  async active(@Param('customer') id: string): Promise<IResponse> {
    const doc = await this._customerService._checkCustomer(id);
    await this._customerService.active(doc);
    return { data: doc?._id };
  }

  @CustomerDeleteDoc()
  @ResponseSingle('customer.delete')
  @AdminProtected()
  @RequestParamGuard(CustomerRequestDto)
  @Delete('/delete/:customer')
  async delete(@Param('customer') id: string): Promise<IResponse> {
    const doc = await this._customerService._checkCustomer(id);
    await this._customerService.delete(doc);
    return { data: doc?._id };
  }
}
