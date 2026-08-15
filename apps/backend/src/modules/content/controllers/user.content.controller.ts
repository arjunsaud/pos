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
  CONTENT_DEFAULT_AVAILABLE_ORDER_BY,
  CONTENT_DEFAULT_AVAILABLE_SEARCH,
  CONTENT_DEFAULT_ORDER_BY,
  CONTENT_DEFAULT_ORDER_DIRECTION,
  CONTENT_DEFAULT_PER_PAGE,
} from '../constants/content.list.constant';
import {
  ContentActiveDoc,
  ContentCreateDoc,
  ContentDeleteDoc,
  ContentGetDoc,
  ContentInactiveDoc,
  ContentListDoc,
  ContentUpdateDoc,
} from '../docs/content.doc';
import { ContentCreateDto } from '../dtos/content.create.dto';
import { ContentRequestDto } from '../dtos/content.request.dto';
import { ContentUpdateDto } from '../dtos/content.update.dto';
import { IContentEntity } from '../interfaces/content.entity.interface';
import { ContentDoc } from '../repository/entities/content.entity';
import { ContentGetSerialization } from '../serializations/content.get.serialization';
import { ContentListSerialization } from '../serializations/content.list.serialization';
import { ContentService } from '../services/content.service';

@ApiTags('Content')
@Controller({ version: '1', path: '/content' })
export class UserContentController {
  constructor(
    private readonly _contentService: ContentService,
    private readonly paginationService: PaginationService,
  ) {}

  @ContentListDoc()
  @ResponsePaging('content.list', {
    serialization: ContentListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      CONTENT_DEFAULT_PER_PAGE,
      CONTENT_DEFAULT_ORDER_BY,
      CONTENT_DEFAULT_ORDER_DIRECTION,
      CONTENT_DEFAULT_AVAILABLE_SEARCH,
      CONTENT_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search };

    const docs: IContentEntity[] = await this._contentService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._contentService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @ContentGetDoc()
  @ResponseSingle('content.get', {
    serialization: ContentGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(ContentRequestDto)
  @Get('/get/:content')
  async get(@Param('content') id: string): Promise<IResponse> {
    const doc = await this._contentService._checkContent(id);
    return { data: doc };
  }

  @ContentCreateDoc()
  @ResponseSingle('content.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: ContentCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: ContentDoc = await this._contentService.create(data);
    return {
      data: doc?._id,
    };
  }

  @ContentUpdateDoc()
  @ResponseSingle('content.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(ContentRequestDto)
  @Patch('/update/:content')
  async update(
    @Param('content') id: string,
    @Body()
    body: ContentUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._contentService._checkContent(id);
    await this._contentService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @ContentInactiveDoc()
  @ResponseSingle('content.inactive')
  @UserProtected()
  @RequestParamGuard(ContentRequestDto)
  @Patch('/update/inactive/:content')
  async inactive(@Param('content') id: string): Promise<IResponse> {
    const doc = await this._contentService._checkContent(id);
    await this._contentService.inactive(doc);
    return { data: doc?._id };
  }

  @ContentActiveDoc()
  @ResponseSingle('content.active')
  @UserProtected()
  @RequestParamGuard(ContentRequestDto)
  @Patch('/update/active/:content')
  async active(@Param('content') id: string): Promise<IResponse> {
    const doc = await this._contentService._checkContent(id);
    await this._contentService.active(doc);
    return { data: doc?._id };
  }

  @ContentDeleteDoc()
  @ResponseSingle('content.delete')
  @UserProtected()
  @RequestParamGuard(ContentRequestDto)
  @Delete('/delete/:content')
  async delete(@Param('content') id: string): Promise<IResponse> {
    const doc = await this._contentService._checkContent(id);
    await this._contentService.delete(doc);
    return { data: doc?._id };
  }
}
