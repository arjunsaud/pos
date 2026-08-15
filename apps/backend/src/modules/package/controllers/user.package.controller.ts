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
  PACKAGE_DEFAULT_AVAILABLE_ORDER_BY,
  PACKAGE_DEFAULT_AVAILABLE_SEARCH,
  PACKAGE_DEFAULT_ORDER_BY,
  PACKAGE_DEFAULT_ORDER_DIRECTION,
  PACKAGE_DEFAULT_PER_PAGE,
} from '../constants/package.list.constant';
import {
  PackageActiveDoc,
  PackageCreateDoc,
  PackageDeleteDoc,
  PackageGetDoc,
  PackageInactiveDoc,
  PackageListDoc,
  PackageUpdateDoc,
} from '../docs/package.doc';
import { PackageCreateDto } from '../dtos/package.create.dto';
import { PackageRequestDto } from '../dtos/package.request.dto';
import { PackageUpdateDto } from '../dtos/package.update.dto';
import { IPackageEntity } from '../interfaces/package.entity.interface';
import { PackageDoc } from '../repository/entities/package.entity';
import { PackageGetSerialization } from '../serializations/package.get.serialization';
import { PackageListSerialization } from '../serializations/package.list.serialization';
import { PackageService } from '../services/package.service';

@ApiTags('Package')
@Controller({ version: '1', path: '/package' })
export class UserPackageController {
  constructor(
    private readonly _packageService: PackageService,
    private readonly paginationService: PaginationService,
  ) {}

  @PackageListDoc()
  @ResponsePaging('package.public', {
    serialization: PackageListSerialization,
  })
  @Get('/public')
  async publicList(
    @PaginationQuery(
      PACKAGE_DEFAULT_PER_PAGE,
      PACKAGE_DEFAULT_ORDER_BY,
      PACKAGE_DEFAULT_ORDER_DIRECTION,
      PACKAGE_DEFAULT_AVAILABLE_SEARCH,
      PACKAGE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search, status: 'active' };
    const docs: IPackageEntity[] = await this._packageService.findAll(find, {
      paging: { limit: _limit, offset: _offset },
      order: _order,
    });
    const total: number = await this._packageService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);
    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @PackageListDoc()
  @ResponsePaging('package.list', {
    serialization: PackageListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      PACKAGE_DEFAULT_PER_PAGE,
      PACKAGE_DEFAULT_ORDER_BY,
      PACKAGE_DEFAULT_ORDER_DIRECTION,
      PACKAGE_DEFAULT_AVAILABLE_SEARCH,
      PACKAGE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search };

    const docs: IPackageEntity[] = await this._packageService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._packageService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @PackageGetDoc()
  @ResponseSingle('package.get', {
    serialization: PackageGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(PackageRequestDto)
  @Get('/get/:package')
  async get(@Param('package') id: string): Promise<IResponse> {
    const doc = await this._packageService._checkPackage(id);
    return { data: doc };
  }

  @PackageCreateDoc()
  @ResponseSingle('package.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: PackageCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: PackageDoc = await this._packageService.create(data);
    return {
      data: doc?._id,
    };
  }

  @PackageUpdateDoc()
  @ResponseSingle('package.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(PackageRequestDto)
  @Patch('/update/:package')
  async update(
    @Param('package') id: string,
    @Body()
    body: PackageUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._packageService._checkPackage(id);
    await this._packageService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @PackageInactiveDoc()
  @ResponseSingle('package.inactive')
  @UserProtected()
  @RequestParamGuard(PackageRequestDto)
  @Patch('/update/inactive/:package')
  async inactive(@Param('package') id: string): Promise<IResponse> {
    const doc = await this._packageService._checkPackage(id);
    await this._packageService.inactive(doc);
    return { data: doc?._id };
  }

  @PackageActiveDoc()
  @ResponseSingle('package.active')
  @UserProtected()
  @RequestParamGuard(PackageRequestDto)
  @Patch('/update/active/:package')
  async active(@Param('package') id: string): Promise<IResponse> {
    const doc = await this._packageService._checkPackage(id);
    await this._packageService.active(doc);
    return { data: doc?._id };
  }

  @PackageDeleteDoc()
  @ResponseSingle('package.delete')
  @UserProtected()
  @RequestParamGuard(PackageRequestDto)
  @Delete('/delete/:package')
  async delete(@Param('package') id: string): Promise<IResponse> {
    const doc = await this._packageService._checkPackage(id);
    await this._packageService.delete(doc);
    return { data: doc?._id };
  }
}
