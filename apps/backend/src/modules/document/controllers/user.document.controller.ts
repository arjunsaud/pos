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
  DOCUMENT_DEFAULT_AVAILABLE_ORDER_BY,
  DOCUMENT_DEFAULT_AVAILABLE_SEARCH,
  DOCUMENT_DEFAULT_ORDER_BY,
  DOCUMENT_DEFAULT_ORDER_DIRECTION,
  DOCUMENT_DEFAULT_PER_PAGE,
} from '../constants/document.list.constant';
import {
  DocumentActiveDoc,
  DocumentCreateDoc,
  DocumentDeleteDoc,
  DocumentGetDoc,
  DocumentInactiveDoc,
  DocumentListDoc,
  DocumentUpdateDoc,
} from '../docs/document.doc';
import { DocumentCreateDto } from '../dtos/document.create.dto';
import { DocumentRequestDto } from '../dtos/document.request.dto';
import { DocumentUpdateDto } from '../dtos/document.update.dto';
import { IDocumentEntity } from '../interfaces/document.entity.interface';
import { DocumentDoc } from '../repository/entities/document.entity';
import { DocumentGetSerialization } from '../serializations/document.get.serialization';
import { DocumentListSerialization } from '../serializations/document.list.serialization';
import { DocumentService } from '../services/document.service';

@ApiTags('Document')
@Controller({ version: '1', path: '/document' })
export class UserDocumentController {
  constructor(
    private readonly _documentService: DocumentService,
    private readonly paginationService: PaginationService,
  ) {}

  @DocumentListDoc()
  @ResponsePaging('document.list', {
    serialization: DocumentListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      DOCUMENT_DEFAULT_PER_PAGE,
      DOCUMENT_DEFAULT_ORDER_BY,
      DOCUMENT_DEFAULT_ORDER_DIRECTION,
      DOCUMENT_DEFAULT_AVAILABLE_SEARCH,
      DOCUMENT_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: IDocumentEntity[] = await this._documentService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._documentService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @DocumentGetDoc()
  @ResponseSingle('document.get', {
    serialization: DocumentGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(DocumentRequestDto)
  @Get('/get/:document')
  async get(@Param('document') id: string): Promise<IResponse> {
    const doc = await this._documentService._checkDocument(id);
    return { data: doc };
  }

  @DocumentCreateDoc()
  @ResponseSingle('document.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: DocumentCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: DocumentDoc = await this._documentService.create(data);
    return {
      data: doc?._id,
    };
  }

  @DocumentUpdateDoc()
  @ResponseSingle('document.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(DocumentRequestDto)
  @Patch('/update/:document')
  async update(
    @Param('document') id: string,
    @Body()
    body: DocumentUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._documentService._checkDocument(id);
    await this._documentService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @DocumentInactiveDoc()
  @ResponseSingle('document.inactive')
  @UserProtected()
  @RequestParamGuard(DocumentRequestDto)
  @Patch('/update/inactive/:document')
  async inactive(@Param('document') id: string): Promise<IResponse> {
    const doc = await this._documentService._checkDocument(id);
    await this._documentService.inactive(doc);
    return { data: doc?._id };
  }

  @DocumentActiveDoc()
  @ResponseSingle('document.active')
  @UserProtected()
  @RequestParamGuard(DocumentRequestDto)
  @Patch('/update/active/:document')
  async active(@Param('document') id: string): Promise<IResponse> {
    const doc = await this._documentService._checkDocument(id);
    await this._documentService.active(doc);
    return { data: doc?._id };
  }

  @DocumentDeleteDoc()
  @ResponseSingle('document.delete')
  @UserProtected()
  @RequestParamGuard(DocumentRequestDto)
  @Delete('/delete/:document')
  async delete(@Param('document') id: string): Promise<IResponse> {
    const doc = await this._documentService._checkDocument(id);
    await this._documentService.delete(doc);
    return { data: doc?._id };
  }
}
