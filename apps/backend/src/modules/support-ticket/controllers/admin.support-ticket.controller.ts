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
  SUPPORT_TICKET_DEFAULT_AVAILABLE_ORDER_BY,
  SUPPORT_TICKET_DEFAULT_AVAILABLE_SEARCH,
  SUPPORT_TICKET_DEFAULT_ORDER_BY,
  SUPPORT_TICKET_DEFAULT_ORDER_DIRECTION,
  SUPPORT_TICKET_DEFAULT_PER_PAGE,
} from '../constants/support-ticket.list.constant';
import {
  SupportTicketActiveDoc,
  SupportTicketCreateDoc,
  SupportTicketDeleteDoc,
  SupportTicketGetDoc,
  SupportTicketInactiveDoc,
  SupportTicketListDoc,
  SupportTicketUpdateDoc,
} from '../docs/support-ticket.doc';
import { SupportTicketCreateDto } from '../dtos/support-ticket.create.dto';
import { SupportTicketRequestDto } from '../dtos/support-ticket.request.dto';
import { SupportTicketUpdateDto } from '../dtos/support-ticket.update.dto';
import { ISupportTicketEntity } from '../interfaces/support-ticket.entity.interface';
import { SupportTicketDoc } from '../repository/entities/support-ticket.entity';
import { SupportTicketGetSerialization } from '../serializations/support-ticket.get.serialization';
import { SupportTicketListSerialization } from '../serializations/support-ticket.list.serialization';
import { SupportTicketService } from '../services/support-ticket.service';

@ApiTags('SupportTicket')
@Controller({ version: '1', path: '/support-ticket' })
export class AdminSupportTicketController {
  constructor(
    private readonly _supportTicketService: SupportTicketService,
    private readonly paginationService: PaginationService,
  ) {}

  @SupportTicketListDoc()
  @ResponsePaging('supportTicket.list', {
    serialization: SupportTicketListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      SUPPORT_TICKET_DEFAULT_PER_PAGE,
      SUPPORT_TICKET_DEFAULT_ORDER_BY,
      SUPPORT_TICKET_DEFAULT_ORDER_DIRECTION,
      SUPPORT_TICKET_DEFAULT_AVAILABLE_SEARCH,
      SUPPORT_TICKET_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: ISupportTicketEntity[] = await this._supportTicketService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._supportTicketService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @SupportTicketGetDoc()
  @ResponseSingle('supportTicket.get', {
    serialization: SupportTicketGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(SupportTicketRequestDto)
  @Get('/get/:supportTicket')
  async get(@Param('supportTicket') id: string): Promise<IResponse> {
    const doc = await this._supportTicketService._checkSupportTicket(id);
    return { data: doc };
  }

  @SupportTicketCreateDoc()
  @ResponseSingle('supportTicket.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: SupportTicketCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: SupportTicketDoc = await this._supportTicketService.create(data);
    return {
      data: doc?._id,
    };
  }

  @SupportTicketUpdateDoc()
  @ResponseSingle('supportTicket.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(SupportTicketRequestDto)
  @Patch('/update/:supportTicket')
  async update(
    @Param('supportTicket') id: string,
    @Body()
    body: SupportTicketUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._supportTicketService._checkSupportTicket(id);
    await this._supportTicketService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @SupportTicketInactiveDoc()
  @ResponseSingle('supportTicket.inactive')
  @AdminProtected()
  @RequestParamGuard(SupportTicketRequestDto)
  @Patch('/update/inactive/:supportTicket')
  async inactive(@Param('supportTicket') id: string): Promise<IResponse> {
    const doc = await this._supportTicketService._checkSupportTicket(id);
    await this._supportTicketService.inactive(doc);
    return { data: doc?._id };
  }

  @SupportTicketActiveDoc()
  @ResponseSingle('supportTicket.active')
  @AdminProtected()
  @RequestParamGuard(SupportTicketRequestDto)
  @Patch('/update/active/:supportTicket')
  async active(@Param('supportTicket') id: string): Promise<IResponse> {
    const doc = await this._supportTicketService._checkSupportTicket(id);
    await this._supportTicketService.active(doc);
    return { data: doc?._id };
  }

  @SupportTicketDeleteDoc()
  @ResponseSingle('supportTicket.delete')
  @AdminProtected()
  @RequestParamGuard(SupportTicketRequestDto)
  @Delete('/delete/:supportTicket')
  async delete(@Param('supportTicket') id: string): Promise<IResponse> {
    const doc = await this._supportTicketService._checkSupportTicket(id);
    await this._supportTicketService.delete(doc);
    return { data: doc?._id };
  }
}
