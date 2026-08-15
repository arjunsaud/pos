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
  VENDOR_DEFAULT_AVAILABLE_ORDER_BY,
  VENDOR_DEFAULT_AVAILABLE_SEARCH,
  VENDOR_DEFAULT_ORDER_BY,
  VENDOR_DEFAULT_ORDER_DIRECTION,
  VENDOR_DEFAULT_PER_PAGE,
} from '../constants/vendor.list.constant';
import {
  VendorActiveDoc,
  VendorCreateDoc,
  VendorDeleteDoc,
  VendorGetDoc,
  VendorInactiveDoc,
  VendorListDoc,
  VendorUpdateDoc,
} from '../docs/vendor.doc';
import { VendorCreateDto } from '../dtos/vendor.create.dto';
import { VendorRequestDto } from '../dtos/vendor.request.dto';
import { VendorUpdateDto } from '../dtos/vendor.update.dto';
import { IVendorEntity } from '../interfaces/vendor.entity.interface';
import { VendorDoc } from '../repository/entities/vendor.entity';
import { VendorGetSerialization } from '../serializations/vendor.get.serialization';
import { VendorListSerialization } from '../serializations/vendor.list.serialization';
import { VendorService } from '../services/vendor.service';

@ApiTags('Vendor')
@Controller({ version: '1', path: '/vendor' })
export class UserVendorController {
  constructor(
    private readonly _vendorService: VendorService,
    private readonly paginationService: PaginationService,
  ) {}

  @VendorListDoc()
  @ResponsePaging('vendor.list', {
    serialization: VendorListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      VENDOR_DEFAULT_PER_PAGE,
      VENDOR_DEFAULT_ORDER_BY,
      VENDOR_DEFAULT_ORDER_DIRECTION,
      VENDOR_DEFAULT_AVAILABLE_SEARCH,
      VENDOR_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: IVendorEntity[] = await this._vendorService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._vendorService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @VendorGetDoc()
  @ResponseSingle('vendor.get', {
    serialization: VendorGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(VendorRequestDto)
  @Get('/get/:vendor')
  async get(@Param('vendor') id: string): Promise<IResponse> {
    const doc = await this._vendorService._checkVendor(id);
    return { data: doc };
  }

  @VendorCreateDoc()
  @ResponseSingle('vendor.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: VendorCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: VendorDoc = await this._vendorService.create(data);
    return {
      data: doc?._id,
    };
  }

  @VendorUpdateDoc()
  @ResponseSingle('vendor.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(VendorRequestDto)
  @Patch('/update/:vendor')
  async update(
    @Param('vendor') id: string,
    @Body()
    body: VendorUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._vendorService._checkVendor(id);
    await this._vendorService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @VendorInactiveDoc()
  @ResponseSingle('vendor.inactive')
  @UserProtected()
  @RequestParamGuard(VendorRequestDto)
  @Patch('/update/inactive/:vendor')
  async inactive(@Param('vendor') id: string): Promise<IResponse> {
    const doc = await this._vendorService._checkVendor(id);
    await this._vendorService.inactive(doc);
    return { data: doc?._id };
  }

  @VendorActiveDoc()
  @ResponseSingle('vendor.active')
  @UserProtected()
  @RequestParamGuard(VendorRequestDto)
  @Patch('/update/active/:vendor')
  async active(@Param('vendor') id: string): Promise<IResponse> {
    const doc = await this._vendorService._checkVendor(id);
    await this._vendorService.active(doc);
    return { data: doc?._id };
  }

  @VendorDeleteDoc()
  @ResponseSingle('vendor.delete')
  @UserProtected()
  @RequestParamGuard(VendorRequestDto)
  @Delete('/delete/:vendor')
  async delete(@Param('vendor') id: string): Promise<IResponse> {
    const doc = await this._vendorService._checkVendor(id);
    await this._vendorService.delete(doc);
    return { data: doc?._id };
  }
}
