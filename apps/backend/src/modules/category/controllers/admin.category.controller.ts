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
  CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
  CATEGORY_DEFAULT_AVAILABLE_SEARCH,
  CATEGORY_DEFAULT_ORDER_BY,
  CATEGORY_DEFAULT_ORDER_DIRECTION,
  CATEGORY_DEFAULT_PER_PAGE,
} from '../constants/category.list.constant';
import {
  CategoryActiveDoc,
  CategoryCreateDoc,
  CategoryDeleteDoc,
  CategoryGetDoc,
  CategoryInactiveDoc,
  CategoryListDoc,
  CategoryUpdateDoc,
} from '../docs/category.doc';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { CategoryRequestDto } from '../dtos/category.request.dto';
import { CategoryUpdateDto } from '../dtos/category.update.dto';
import { ICategoryEntity } from '../interfaces/category.entity.interface';
import { CategoryDoc } from '../repository/entities/category.entity';
import { CategoryGetSerialization } from '../serializations/category.get.serialization';
import { CategoryListSerialization } from '../serializations/category.list.serialization';
import { CategoryService } from '../services/category.service';

@ApiTags('Category')
@Controller({ version: '1', path: '/category' })
export class AdminCategoryController {
  constructor(
    private readonly _categoryService: CategoryService,
    private readonly paginationService: PaginationService,
  ) {}

  @CategoryListDoc()
  @ResponsePaging('category.list', {
    serialization: CategoryListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      CATEGORY_DEFAULT_PER_PAGE,
      CATEGORY_DEFAULT_ORDER_BY,
      CATEGORY_DEFAULT_ORDER_DIRECTION,
      CATEGORY_DEFAULT_AVAILABLE_SEARCH,
      CATEGORY_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: ICategoryEntity[] = await this._categoryService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._categoryService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @CategoryGetDoc()
  @ResponseSingle('category.get', {
    serialization: CategoryGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(CategoryRequestDto)
  @Get('/get/:category')
  async get(@Param('category') id: string): Promise<IResponse> {
    const doc = await this._categoryService._checkCategory(id);
    return { data: doc };
  }

  @CategoryCreateDoc()
  @ResponseSingle('category.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: CategoryCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: CategoryDoc = await this._categoryService.create(data);
    return {
      data: doc?._id,
    };
  }

  @CategoryUpdateDoc()
  @ResponseSingle('category.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(CategoryRequestDto)
  @Patch('/update/:category')
  async update(
    @Param('category') id: string,
    @Body()
    body: CategoryUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._categoryService._checkCategory(id);
    await this._categoryService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @CategoryInactiveDoc()
  @ResponseSingle('category.inactive')
  @AdminProtected()
  @RequestParamGuard(CategoryRequestDto)
  @Patch('/update/inactive/:category')
  async inactive(@Param('category') id: string): Promise<IResponse> {
    const doc = await this._categoryService._checkCategory(id);
    await this._categoryService.inactive(doc);
    return { data: doc?._id };
  }

  @CategoryActiveDoc()
  @ResponseSingle('category.active')
  @AdminProtected()
  @RequestParamGuard(CategoryRequestDto)
  @Patch('/update/active/:category')
  async active(@Param('category') id: string): Promise<IResponse> {
    const doc = await this._categoryService._checkCategory(id);
    await this._categoryService.active(doc);
    return { data: doc?._id };
  }

  @CategoryDeleteDoc()
  @ResponseSingle('category.delete')
  @AdminProtected()
  @RequestParamGuard(CategoryRequestDto)
  @Delete('/delete/:category')
  async delete(@Param('category') id: string): Promise<IResponse> {
    const doc = await this._categoryService._checkCategory(id);
    await this._categoryService.delete(doc);
    return { data: doc?._id };
  }
}
