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
import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import {
  PAYMENT_METHOD_DEFAULT_AVAILABLE_ORDER_BY,
  PAYMENT_METHOD_DEFAULT_AVAILABLE_SEARCH,
  PAYMENT_METHOD_DEFAULT_ORDER_BY,
  PAYMENT_METHOD_DEFAULT_ORDER_DIRECTION,
  PAYMENT_METHOD_DEFAULT_PER_PAGE,
} from '../constants/payment-method.list.constant';
import {
  PaymentMethodActiveDoc,
  PaymentMethodCreateDoc,
  PaymentMethodDeleteDoc,
  PaymentMethodGetDoc,
  PaymentMethodInactiveDoc,
  PaymentMethodListDoc,
  PaymentMethodUpdateDoc,
} from '../docs/payment-method.doc';
import { PaymentMethodCreateDto } from '../dtos/payment-method.create.dto';
import { PaymentMethodRequestDto } from '../dtos/payment-method.request.dto';
import { PaymentMethodUpdateDto } from '../dtos/payment-method.update.dto';
import { IPaymentMethodEntity } from '../interfaces/payment-method.entity.interface';
import { PaymentMethodDoc } from '../repository/entities/payment-method.entity';
import { PaymentMethodGetSerialization } from '../serializations/payment-method.get.serialization';
import { PaymentMethodListSerialization } from '../serializations/payment-method.list.serialization';
import { PaymentMethodService } from '../services/payment-method.service';

@ApiTags('PaymentMethod')
@Controller({ version: '1', path: '/payment-method' })
export class AdminPaymentMethodController {
  constructor(
    private readonly _paymentMethodService: PaymentMethodService,
    private readonly paginationService: PaginationService,
  ) {}

  @PaymentMethodListDoc()
  @ResponsePaging('paymentMethod.list', {
    serialization: PaymentMethodListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      PAYMENT_METHOD_DEFAULT_PER_PAGE,
      PAYMENT_METHOD_DEFAULT_ORDER_BY,
      PAYMENT_METHOD_DEFAULT_ORDER_DIRECTION,
      PAYMENT_METHOD_DEFAULT_AVAILABLE_SEARCH,
      PAYMENT_METHOD_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search };

    const docs: IPaymentMethodEntity[] = await this._paymentMethodService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._paymentMethodService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @PaymentMethodGetDoc()
  @ResponseSingle('paymentMethod.get', {
    serialization: PaymentMethodGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(PaymentMethodRequestDto)
  @Get('/get/:paymentMethod')
  async get(@Param('paymentMethod') id: string): Promise<IResponse> {
    const doc = await this._paymentMethodService._checkPaymentMethod(id);
    return { data: doc };
  }

  @PaymentMethodCreateDoc()
  @ResponseSingle('paymentMethod.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: PaymentMethodCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: PaymentMethodDoc = await this._paymentMethodService.create(data);
    return {
      data: doc?._id,
    };
  }

  @PaymentMethodUpdateDoc()
  @ResponseSingle('paymentMethod.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(PaymentMethodRequestDto)
  @Patch('/update/:paymentMethod')
  async update(
    @Param('paymentMethod') id: string,
    @Body()
    body: PaymentMethodUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._paymentMethodService._checkPaymentMethod(id);
    await this._paymentMethodService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @PaymentMethodInactiveDoc()
  @ResponseSingle('paymentMethod.inactive')
  @AdminProtected()
  @RequestParamGuard(PaymentMethodRequestDto)
  @Patch('/update/inactive/:paymentMethod')
  async inactive(@Param('paymentMethod') id: string): Promise<IResponse> {
    const doc = await this._paymentMethodService._checkPaymentMethod(id);
    await this._paymentMethodService.inactive(doc);
    return { data: doc?._id };
  }

  @PaymentMethodActiveDoc()
  @ResponseSingle('paymentMethod.active')
  @AdminProtected()
  @RequestParamGuard(PaymentMethodRequestDto)
  @Patch('/update/active/:paymentMethod')
  async active(@Param('paymentMethod') id: string): Promise<IResponse> {
    const doc = await this._paymentMethodService._checkPaymentMethod(id);
    await this._paymentMethodService.active(doc);
    return { data: doc?._id };
  }

  @PaymentMethodDeleteDoc()
  @ResponseSingle('paymentMethod.delete')
  @AdminProtected()
  @RequestParamGuard(PaymentMethodRequestDto)
  @Delete('/delete/:paymentMethod')
  async delete(@Param('paymentMethod') id: string): Promise<IResponse> {
    const doc = await this._paymentMethodService._checkPaymentMethod(id);
    await this._paymentMethodService.delete(doc);
    return { data: doc?._id };
  }
}
