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
import { PurchaseDocParamsId } from '../constants/purchase.doc.constant';
import { PurchaseCreateDto } from '../dtos/purchase.create.dto';
import { PurchaseUpdateDto } from '../dtos/purchase.update.dto';
import { PurchaseGetSerialization } from '../serializations/purchase.get.serialization';
import { PurchaseListSerialization } from '../serializations/purchase.list.serialization';

export function PurchaseListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all purchase' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<PurchaseListSerialization>('purchase.list', {
      serialization: PurchaseListSerialization,
    }),
  );
}

export function PurchaseGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of purchase' }),
    DocRequest({ params: PurchaseDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<PurchaseGetSerialization>('purchase.get', {
      serialization: PurchaseGetSerialization,
    }),
  );
}

export function PurchaseCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create purchase' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PurchaseCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('purchase.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PurchaseUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update purchase' }),
    DocRequest({
      params: PurchaseDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PurchaseUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('purchase.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PurchaseInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make purchase inactive' }),
    DocRequest({ params: PurchaseDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('purchase.inactive'),
  );
}

export function PurchaseActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make purchase active' }),
    DocRequest({ params: PurchaseDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('purchase.active'),
  );
}

export function PurchaseDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'purchase.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: PurchaseDocParamsId }),
    DocResponse('purchase.delete'),
  );
}
