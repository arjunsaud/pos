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
  RETURN_REFUND_DEFAULT_AVAILABLE_ORDER_BY,
  RETURN_REFUND_DEFAULT_AVAILABLE_SEARCH,
  RETURN_REFUND_DEFAULT_ORDER_BY,
  RETURN_REFUND_DEFAULT_ORDER_DIRECTION,
  RETURN_REFUND_DEFAULT_PER_PAGE,
} from '../constants/return-refund.list.constant';
import {
  ReturnRefundActiveDoc,
  ReturnRefundCreateDoc,
  ReturnRefundDeleteDoc,
  ReturnRefundGetDoc,
  ReturnRefundInactiveDoc,
  ReturnRefundListDoc,
  ReturnRefundUpdateDoc,
} from '../docs/return-refund.doc';
import { ReturnRefundCreateDto } from '../dtos/return-refund.create.dto';
import { ReturnRefundRequestDto } from '../dtos/return-refund.request.dto';
import { ReturnRefundUpdateDto } from '../dtos/return-refund.update.dto';
import { IReturnRefundEntity } from '../interfaces/return-refund.entity.interface';
import { ReturnRefundDoc } from '../repository/entities/return-refund.entity';
import { ReturnRefundGetSerialization } from '../serializations/return-refund.get.serialization';
import { ReturnRefundListSerialization } from '../serializations/return-refund.list.serialization';
import { ReturnRefundService } from '../services/return-refund.service';

@ApiTags('ReturnRefund')
@Controller({ version: '1', path: '/return-refund' })
export class AdminReturnRefundController {
  constructor(
    private readonly _returnRefundService: ReturnRefundService,
    private readonly paginationService: PaginationService,
  ) {}

  @ReturnRefundListDoc()
  @ResponsePaging('returnRefund.list', {
    serialization: ReturnRefundListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      RETURN_REFUND_DEFAULT_PER_PAGE,
      RETURN_REFUND_DEFAULT_ORDER_BY,
      RETURN_REFUND_DEFAULT_ORDER_DIRECTION,
      RETURN_REFUND_DEFAULT_AVAILABLE_SEARCH,
      RETURN_REFUND_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: IReturnRefundEntity[] = await this._returnRefundService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._returnRefundService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @ReturnRefundGetDoc()
  @ResponseSingle('returnRefund.get', {
    serialization: ReturnRefundGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Get('/get/:returnRefund')
  async get(@Param('returnRefund') id: string): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    return { data: doc };
  }

  @ReturnRefundCreateDoc()
  @ResponseSingle('returnRefund.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: ReturnRefundCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: ReturnRefundDoc = await this._returnRefundService.create(data);
    return {
      data: doc?._id,
    };
  }

  @ReturnRefundUpdateDoc()
  @ResponseSingle('returnRefund.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Patch('/update/:returnRefund')
  async update(
    @Param('returnRefund') id: string,
    @Body()
    body: ReturnRefundUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    await this._returnRefundService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @ReturnRefundInactiveDoc()
  @ResponseSingle('returnRefund.inactive')
  @AdminProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Patch('/update/inactive/:returnRefund')
  async inactive(@Param('returnRefund') id: string): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    await this._returnRefundService.inactive(doc);
    return { data: doc?._id };
  }

  @ReturnRefundActiveDoc()
  @ResponseSingle('returnRefund.active')
  @AdminProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Patch('/update/active/:returnRefund')
  async active(@Param('returnRefund') id: string): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    await this._returnRefundService.active(doc);
    return { data: doc?._id };
  }

  @ReturnRefundDeleteDoc()
  @ResponseSingle('returnRefund.delete')
  @AdminProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Delete('/delete/:returnRefund')
  async delete(@Param('returnRefund') id: string): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    await this._returnRefundService.delete(doc);
    return { data: doc?._id };
  }
}
