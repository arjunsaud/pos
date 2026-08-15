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
  TEMPLATE_DEFAULT_AVAILABLE_ORDER_BY,
  TEMPLATE_DEFAULT_AVAILABLE_SEARCH,
  TEMPLATE_DEFAULT_ORDER_BY,
  TEMPLATE_DEFAULT_ORDER_DIRECTION,
  TEMPLATE_DEFAULT_PER_PAGE,
} from '../constants/template.list.constant';
import {
  TemplateActiveDoc,
  TemplateCreateDoc,
  TemplateDeleteDoc,
  TemplateGetDoc,
  TemplateInactiveDoc,
  TemplateListDoc,
  TemplateUpdateDoc,
} from '../docs/template.doc';
import { TemplateCreateDto } from '../dtos/template.create.dto';
import { TemplateRequestDto } from '../dtos/template.request.dto';
import { TemplateUpdateDto } from '../dtos/template.update.dto';
import { ITemplateEntity } from '../interfaces/template.entity.interface';
import { TemplateDoc } from '../repository/entities/template.entity';
import { TemplateGetSerialization } from '../serializations/template.get.serialization';
import { TemplateListSerialization } from '../serializations/template.list.serialization';
import { TemplateService } from '../services/template.service';

@ApiTags('Templates')
@Controller({ version: '1', path: '/template' })
export class AdminTemplateController {
  constructor(
    private readonly _templateService: TemplateService,
    private readonly paginationService: PaginationService,
  ) {}

  @TemplateListDoc()
  @ResponsePaging('template.list', {
    serialization: TemplateListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      TEMPLATE_DEFAULT_PER_PAGE,
      TEMPLATE_DEFAULT_ORDER_BY,
      TEMPLATE_DEFAULT_ORDER_DIRECTION,
      TEMPLATE_DEFAULT_AVAILABLE_SEARCH,
      TEMPLATE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('type') type?: string,
  ): Promise<IResponsePaging> {
    await this._templateService.ensureDefaults();
    const find: Record<string, any> = { ..._search };
    if (type === 'invoice' || type === 'receipt') find.type = type;

    const docs: ITemplateEntity[] = await this._templateService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._templateService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @TemplateGetDoc()
  @ResponseSingle('template.get', {
    serialization: TemplateGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(TemplateRequestDto)
  @Get('/get/:template')
  async get(@Param('template') id: string): Promise<IResponse> {
    const doc = await this._templateService._checkTemplate(id);
    return { data: doc };
  }

  @TemplateCreateDoc()
  @ResponseSingle('template.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: TemplateCreateDto,
  ): Promise<IResponse> {
    const doc: TemplateDoc = await this._templateService.create(body);
    return {
      data: doc?._id,
    };
  }

  @TemplateUpdateDoc()
  @ResponseSingle('template.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(TemplateRequestDto)
  @Patch('/update/:template')
  async update(
    @Param('template') id: string,
    @Body()
    body: TemplateUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._templateService._checkTemplate(id);
    await this._templateService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @TemplateInactiveDoc()
  @ResponseSingle('template.inactive')
  @AdminProtected()
  @RequestParamGuard(TemplateRequestDto)
  @Patch('/update/inactive/:template')
  async inactive(@Param('template') id: string): Promise<IResponse> {
    const doc = await this._templateService._checkTemplate(id);
    await this._templateService.inactive(doc);
    return { data: doc?._id };
  }

  @TemplateActiveDoc()
  @ResponseSingle('template.active')
  @AdminProtected()
  @RequestParamGuard(TemplateRequestDto)
  @Patch('/update/active/:template')
  async active(@Param('template') id: string): Promise<IResponse> {
    const doc = await this._templateService._checkTemplate(id);
    await this._templateService.active(doc);
    return { data: doc?._id };
  }

  @TemplateDeleteDoc()
  @ResponseSingle('template.delete')
  @AdminProtected()
  @RequestParamGuard(TemplateRequestDto)
  @Delete('/delete/:template')
  async delete(@Param('template') id: string): Promise<IResponse> {
    const doc = await this._templateService._checkTemplate(id);
    await this._templateService.delete(doc);
    return { data: doc?._id };
  }
}
