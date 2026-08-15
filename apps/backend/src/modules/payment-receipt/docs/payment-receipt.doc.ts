import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { PaymentReceiptDocParamsId } from '../constants/payment-receipt.doc.constant';
import { PaymentReceiptCreateDto } from '../dtos/payment-receipt.create.dto';
import { PaymentReceiptUpdateDto } from '../dtos/payment-receipt.update.dto';
import { PaymentReceiptGetSerialization } from '../serializations/payment-receipt.get.serialization';
import { PaymentReceiptListSerialization } from '../serializations/payment-receipt.list.serialization';

export function PaymentReceiptListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all payment-receipt' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<PaymentReceiptListSerialization>('paymentReceipt.list', {
      serialization: PaymentReceiptListSerialization,
    }),
  );
}

export function PaymentReceiptGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of payment-receipt' }),
    DocRequest({ params: PaymentReceiptDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<PaymentReceiptGetSerialization>('paymentReceipt.get', {
      serialization: PaymentReceiptGetSerialization,
    }),
  );
}

export function PaymentReceiptCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create payment-receipt' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PaymentReceiptCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('paymentReceipt.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PaymentReceiptUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update payment-receipt' }),
    DocRequest({
      params: PaymentReceiptDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PaymentReceiptUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('paymentReceipt.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PaymentReceiptInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make payment-receipt inactive' }),
    DocRequest({ params: PaymentReceiptDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('paymentReceipt.inactive'),
  );
}

export function PaymentReceiptActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make payment-receipt active' }),
    DocRequest({ params: PaymentReceiptDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('paymentReceipt.active'),
  );
}

export function PaymentReceiptDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'paymentReceipt.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: PaymentReceiptDocParamsId }),
    DocResponse('paymentReceipt.delete'),
  );
}
