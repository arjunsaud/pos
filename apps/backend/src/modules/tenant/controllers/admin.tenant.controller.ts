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
import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import {
  TENANT_DEFAULT_AVAILABLE_ORDER_BY,
  TENANT_DEFAULT_AVAILABLE_SEARCH,
  TENANT_DEFAULT_ORDER_BY,
  TENANT_DEFAULT_ORDER_DIRECTION,
  TENANT_DEFAULT_PER_PAGE,
} from '../constants/tenant.list.constant';
import {
  TenantActiveDoc,
  TenantCreateDoc,
  TenantDeleteDoc,
  TenantGetDoc,
  TenantInactiveDoc,
  TenantListDoc,
  TenantUpdateDoc,
} from '../docs/tenant.doc';
import { TenantCreateDto } from '../dtos/tenant.create.dto';
import { TenantRequestDto } from '../dtos/tenant.request.dto';
import { TenantUpdateDto } from '../dtos/tenant.update.dto';
import { ITenantEntity } from '../interfaces/tenant.entity.interface';
import { TenantDoc } from '../repository/entities/tenant.entity';
import { TenantGetSerialization } from '../serializations/tenant.get.serialization';
import { TenantListSerialization } from '../serializations/tenant.list.serialization';
import { TenantService } from '../services/tenant.service';

@ApiTags('Tenant')
@Controller({ version: '1', path: '/tenant' })
export class AdminTenantController {
  constructor(
    private readonly _tenantService: TenantService,
    private readonly paginationService: PaginationService,
  ) {}

  @TenantListDoc()
  @ResponsePaging('tenant.list', {
    serialization: TenantListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      TENANT_DEFAULT_PER_PAGE,
      TENANT_DEFAULT_ORDER_BY,
      TENANT_DEFAULT_ORDER_DIRECTION,
      TENANT_DEFAULT_AVAILABLE_SEARCH,
      TENANT_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search };

    const docs: ITenantEntity[] = await this._tenantService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._tenantService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @TenantGetDoc()
  @ResponseSingle('tenant.get', {
    serialization: TenantGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(TenantRequestDto)
  @Get('/get/:tenant')
  async get(@Param('tenant') id: string): Promise<IResponse> {
    const doc = await this._tenantService._checkTenant(id);
    return { data: doc };
  }

  @TenantCreateDoc()
  @ResponseSingle('tenant.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: TenantCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: TenantDoc = await this._tenantService.create(data);
    return {
      data: doc?._id,
    };
  }

  @TenantUpdateDoc()
  @ResponseSingle('tenant.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(TenantRequestDto)
  @Patch('/update/:tenant')
  async update(
    @Param('tenant') id: string,
    @Body()
    body: TenantUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._tenantService._checkTenant(id);
    await this._tenantService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @TenantInactiveDoc()
  @ResponseSingle('tenant.inactive')
  @AdminProtected()
  @RequestParamGuard(TenantRequestDto)
  @Patch('/update/inactive/:tenant')
  async inactive(@Param('tenant') id: string): Promise<IResponse> {
    const doc = await this._tenantService._checkTenant(id);
    await this._tenantService.inactive(doc);
    return { data: doc?._id };
  }

  @TenantActiveDoc()
  @ResponseSingle('tenant.active')
  @AdminProtected()
  @RequestParamGuard(TenantRequestDto)
  @Patch('/update/active/:tenant')
  async active(@Param('tenant') id: string): Promise<IResponse> {
    const doc = await this._tenantService._checkTenant(id);
    await this._tenantService.active(doc);
    return { data: doc?._id };
  }

  @TenantDeleteDoc()
  @ResponseSingle('tenant.delete')
  @AdminProtected()
  @RequestParamGuard(TenantRequestDto)
  @Delete('/delete/:tenant')
  async delete(@Param('tenant') id: string): Promise<IResponse> {
    const doc = await this._tenantService._checkTenant(id);
    await this._tenantService.delete(doc);
    return { data: doc?._id };
  }
}
