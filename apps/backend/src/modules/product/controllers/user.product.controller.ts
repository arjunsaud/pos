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
  PRODUCT_DEFAULT_AVAILABLE_ORDER_BY,
  PRODUCT_DEFAULT_AVAILABLE_SEARCH,
  PRODUCT_DEFAULT_ORDER_BY,
  PRODUCT_DEFAULT_ORDER_DIRECTION,
  PRODUCT_DEFAULT_PER_PAGE,
} from '../constants/product.list.constant';
import {
  ProductActiveDoc,
  ProductCreateDoc,
  ProductDeleteDoc,
  ProductGetDoc,
  ProductInactiveDoc,
  ProductListDoc,
  ProductUpdateDoc,
} from '../docs/product.doc';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductRequestDto } from '../dtos/product.request.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { IProductEntity } from '../interfaces/product.entity.interface';
import { ProductDoc } from '../repository/entities/product.entity';
import { ProductGetSerialization } from '../serializations/product.get.serialization';
import { ProductListSerialization } from '../serializations/product.list.serialization';
import { ProductService } from '../services/product.service';

@ApiTags('Product')
@Controller({ version: '1', path: '/product' })
export class UserProductController {
  constructor(
    private readonly _productService: ProductService,
    private readonly paginationService: PaginationService,
  ) {}

  @ProductListDoc()
  @ResponsePaging('product.list', {
    serialization: ProductListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      PRODUCT_DEFAULT_PER_PAGE,
      PRODUCT_DEFAULT_ORDER_BY,
      PRODUCT_DEFAULT_ORDER_DIRECTION,
      PRODUCT_DEFAULT_AVAILABLE_SEARCH,
      PRODUCT_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: IProductEntity[] = await this._productService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._productService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @ProductGetDoc()
  @ResponseSingle('product.get', {
    serialization: ProductGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(ProductRequestDto)
  @Get('/get/:product')
  async get(@Param('product') id: string): Promise<IResponse> {
    const doc = await this._productService._checkProduct(id);
    return { data: doc };
  }

  @ProductCreateDoc()
  @ResponseSingle('product.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: ProductCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: ProductDoc = await this._productService.create(data);
    return {
      data: doc?._id,
    };
  }

  @ProductUpdateDoc()
  @ResponseSingle('product.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(ProductRequestDto)
  @Patch('/update/:product')
  async update(
    @Param('product') id: string,
    @Body()
    body: ProductUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._productService._checkProduct(id);
    await this._productService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @ProductInactiveDoc()
  @ResponseSingle('product.inactive')
  @UserProtected()
  @RequestParamGuard(ProductRequestDto)
  @Patch('/update/inactive/:product')
  async inactive(@Param('product') id: string): Promise<IResponse> {
    const doc = await this._productService._checkProduct(id);
    await this._productService.inactive(doc);
    return { data: doc?._id };
  }

  @ProductActiveDoc()
  @ResponseSingle('product.active')
  @UserProtected()
  @RequestParamGuard(ProductRequestDto)
  @Patch('/update/active/:product')
  async active(@Param('product') id: string): Promise<IResponse> {
    const doc = await this._productService._checkProduct(id);
    await this._productService.active(doc);
    return { data: doc?._id };
  }

  @ProductDeleteDoc()
  @ResponseSingle('product.delete')
  @UserProtected()
  @RequestParamGuard(ProductRequestDto)
  @Delete('/delete/:product')
  async delete(@Param('product') id: string): Promise<IResponse> {
    const doc = await this._productService._checkProduct(id);
    await this._productService.delete(doc);
    return { data: doc?._id };
  }
}
