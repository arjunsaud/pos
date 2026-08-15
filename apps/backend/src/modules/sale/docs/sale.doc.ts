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
import { SaleDocParamsId } from '../constants/sale.doc.constant';
import { SaleCreateDto } from '../dtos/sale.create.dto';
import { SaleUpdateDto } from '../dtos/sale.update.dto';
import { SaleGetSerialization } from '../serializations/sale.get.serialization';
import { SaleListSerialization } from '../serializations/sale.list.serialization';

export function SaleListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all sale' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<SaleListSerialization>('sale.list', {
      serialization: SaleListSerialization,
    }),
  );
}

export function SaleGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of sale' }),
    DocRequest({ params: SaleDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<SaleGetSerialization>('sale.get', {
      serialization: SaleGetSerialization,
    }),
  );
}

export function SaleCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create sale' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SaleCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('sale.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function SaleUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update sale' }),
    DocRequest({
      params: SaleDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SaleUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('sale.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function SaleInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make sale inactive' }),
    DocRequest({ params: SaleDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('sale.inactive'),
  );
}

export function SaleActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make sale active' }),
    DocRequest({ params: SaleDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('sale.active'),
  );
}

export function SaleDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'sale.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: SaleDocParamsId }),
    DocResponse('sale.delete'),
  );
}
