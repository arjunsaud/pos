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
  PAYMENT_RECEIPT_DEFAULT_AVAILABLE_ORDER_BY,
  PAYMENT_RECEIPT_DEFAULT_AVAILABLE_SEARCH,
  PAYMENT_RECEIPT_DEFAULT_ORDER_BY,
  PAYMENT_RECEIPT_DEFAULT_ORDER_DIRECTION,
  PAYMENT_RECEIPT_DEFAULT_PER_PAGE,
} from '../constants/payment-receipt.list.constant';
import {
  PaymentReceiptActiveDoc,
  PaymentReceiptCreateDoc,
  PaymentReceiptDeleteDoc,
  PaymentReceiptGetDoc,
  PaymentReceiptInactiveDoc,
  PaymentReceiptListDoc,
  PaymentReceiptUpdateDoc,
} from '../docs/payment-receipt.doc';
import { PaymentReceiptCreateDto } from '../dtos/payment-receipt.create.dto';
import { PaymentReceiptRequestDto } from '../dtos/payment-receipt.request.dto';
import { PaymentReceiptUpdateDto } from '../dtos/payment-receipt.update.dto';
import { IPaymentReceiptEntity } from '../interfaces/payment-receipt.entity.interface';
import { PaymentReceiptDoc } from '../repository/entities/payment-receipt.entity';
import { PaymentReceiptGetSerialization } from '../serializations/payment-receipt.get.serialization';
import { PaymentReceiptListSerialization } from '../serializations/payment-receipt.list.serialization';
import { PaymentReceiptService } from '../services/payment-receipt.service';

@ApiTags('PaymentReceipt')
@Controller({ version: '1', path: '/payment-receipt' })
export class AdminPaymentReceiptController {
  constructor(
    private readonly _paymentReceiptService: PaymentReceiptService,
    private readonly paginationService: PaginationService,
  ) {}

  @PaymentReceiptListDoc()
  @ResponsePaging('paymentReceipt.list', {
    serialization: PaymentReceiptListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      PAYMENT_RECEIPT_DEFAULT_PER_PAGE,
      PAYMENT_RECEIPT_DEFAULT_ORDER_BY,
      PAYMENT_RECEIPT_DEFAULT_ORDER_DIRECTION,
      PAYMENT_RECEIPT_DEFAULT_AVAILABLE_SEARCH,
      PAYMENT_RECEIPT_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: IPaymentReceiptEntity[] = await this._paymentReceiptService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._paymentReceiptService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @PaymentReceiptGetDoc()
  @ResponseSingle('paymentReceipt.get', {
    serialization: PaymentReceiptGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(PaymentReceiptRequestDto)
  @Get('/get/:paymentReceipt')
  async get(@Param('paymentReceipt') id: string): Promise<IResponse> {
    const doc = await this._paymentReceiptService._checkPaymentReceipt(id);
    return { data: doc };
  }

  @PaymentReceiptCreateDoc()
  @ResponseSingle('paymentReceipt.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: PaymentReceiptCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: PaymentReceiptDoc = await this._paymentReceiptService.create(data);
    return {
      data: doc?._id,
    };
  }

  @PaymentReceiptUpdateDoc()
  @ResponseSingle('paymentReceipt.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(PaymentReceiptRequestDto)
  @Patch('/update/:paymentReceipt')
  async update(
    @Param('paymentReceipt') id: string,
    @Body()
    body: PaymentReceiptUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._paymentReceiptService._checkPaymentReceipt(id);
    await this._paymentReceiptService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @PaymentReceiptInactiveDoc()
  @ResponseSingle('paymentReceipt.inactive')
  @AdminProtected()
  @RequestParamGuard(PaymentReceiptRequestDto)
  @Patch('/update/inactive/:paymentReceipt')
  async inactive(@Param('paymentReceipt') id: string): Promise<IResponse> {
    const doc = await this._paymentReceiptService._checkPaymentReceipt(id);
    await this._paymentReceiptService.inactive(doc);
    return { data: doc?._id };
  }

  @PaymentReceiptActiveDoc()
  @ResponseSingle('paymentReceipt.active')
  @AdminProtected()
  @RequestParamGuard(PaymentReceiptRequestDto)
  @Patch('/update/active/:paymentReceipt')
  async active(@Param('paymentReceipt') id: string): Promise<IResponse> {
    const doc = await this._paymentReceiptService._checkPaymentReceipt(id);
    await this._paymentReceiptService.active(doc);
    return { data: doc?._id };
  }

  @PaymentReceiptDeleteDoc()
  @ResponseSingle('paymentReceipt.delete')
  @AdminProtected()
  @RequestParamGuard(PaymentReceiptRequestDto)
  @Delete('/delete/:paymentReceipt')
  async delete(@Param('paymentReceipt') id: string): Promise<IResponse> {
    const doc = await this._paymentReceiptService._checkPaymentReceipt(id);
    await this._paymentReceiptService.delete(doc);
    return { data: doc?._id };
  }
}
