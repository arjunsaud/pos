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
import { CustomerDocParamsId } from '../constants/customer.doc.constant';
import { CustomerCreateDto } from '../dtos/customer.create.dto';
import { CustomerUpdateDto } from '../dtos/customer.update.dto';
import { CustomerGetSerialization } from '../serializations/customer.get.serialization';
import { CustomerListSerialization } from '../serializations/customer.list.serialization';

export function CustomerListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all customer' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<CustomerListSerialization>('customer.list', {
      serialization: CustomerListSerialization,
    }),
  );
}

export function CustomerGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of customer' }),
    DocRequest({ params: CustomerDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<CustomerGetSerialization>('customer.get', {
      serialization: CustomerGetSerialization,
    }),
  );
}

export function CustomerCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create customer' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CustomerCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('customer.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function CustomerUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update customer' }),
    DocRequest({
      params: CustomerDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CustomerUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('customer.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function CustomerInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make customer inactive' }),
    DocRequest({ params: CustomerDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('customer.inactive'),
  );
}

export function CustomerActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make customer active' }),
    DocRequest({ params: CustomerDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('customer.active'),
  );
}

export function CustomerDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'customer.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: CustomerDocParamsId }),
    DocResponse('customer.delete'),
  );
}
