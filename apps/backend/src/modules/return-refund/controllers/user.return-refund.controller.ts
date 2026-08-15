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
export class UserReturnRefundController {
  constructor(
    private readonly _returnRefundService: ReturnRefundService,
    private readonly paginationService: PaginationService,
  ) {}

  @ReturnRefundListDoc()
  @ResponsePaging('returnRefund.list', {
    serialization: ReturnRefundListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      RETURN_REFUND_DEFAULT_PER_PAGE,
      RETURN_REFUND_DEFAULT_ORDER_BY,
      RETURN_REFUND_DEFAULT_ORDER_DIRECTION,
      RETURN_REFUND_DEFAULT_AVAILABLE_SEARCH,
      RETURN_REFUND_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
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
  @UserProtected()
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
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: ReturnRefundCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: ReturnRefundDoc = await this._returnRefundService.create(data);
    return {
      data: doc?._id,
    };
  }

  @ReturnRefundUpdateDoc()
  @ResponseSingle('returnRefund.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
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
  @UserProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Patch('/update/inactive/:returnRefund')
  async inactive(@Param('returnRefund') id: string): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    await this._returnRefundService.inactive(doc);
    return { data: doc?._id };
  }

  @ReturnRefundActiveDoc()
  @ResponseSingle('returnRefund.active')
  @UserProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Patch('/update/active/:returnRefund')
  async active(@Param('returnRefund') id: string): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    await this._returnRefundService.active(doc);
    return { data: doc?._id };
  }

  @ReturnRefundDeleteDoc()
  @ResponseSingle('returnRefund.delete')
  @UserProtected()
  @RequestParamGuard(ReturnRefundRequestDto)
  @Delete('/delete/:returnRefund')
  async delete(@Param('returnRefund') id: string): Promise<IResponse> {
    const doc = await this._returnRefundService._checkReturnRefund(id);
    await this._returnRefundService.delete(doc);
    return { data: doc?._id };
  }
}
