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
import { PaymentMethodDocParamsId } from '../constants/payment-method.doc.constant';
import { PaymentMethodCreateDto } from '../dtos/payment-method.create.dto';
import { PaymentMethodUpdateDto } from '../dtos/payment-method.update.dto';
import { PaymentMethodGetSerialization } from '../serializations/payment-method.get.serialization';
import { PaymentMethodListSerialization } from '../serializations/payment-method.list.serialization';

export function PaymentMethodListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all payment-method' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<PaymentMethodListSerialization>('paymentMethod.list', {
      serialization: PaymentMethodListSerialization,
    }),
  );
}

export function PaymentMethodGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of payment-method' }),
    DocRequest({ params: PaymentMethodDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<PaymentMethodGetSerialization>('paymentMethod.get', {
      serialization: PaymentMethodGetSerialization,
    }),
  );
}

export function PaymentMethodCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create payment-method' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PaymentMethodCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('paymentMethod.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PaymentMethodUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update payment-method' }),
    DocRequest({
      params: PaymentMethodDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PaymentMethodUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('paymentMethod.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PaymentMethodInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make payment-method inactive' }),
    DocRequest({ params: PaymentMethodDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('paymentMethod.inactive'),
  );
}

export function PaymentMethodActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make payment-method active' }),
    DocRequest({ params: PaymentMethodDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('paymentMethod.active'),
  );
}

export function PaymentMethodDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'paymentMethod.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: PaymentMethodDocParamsId }),
    DocResponse('paymentMethod.delete'),
  );
}
