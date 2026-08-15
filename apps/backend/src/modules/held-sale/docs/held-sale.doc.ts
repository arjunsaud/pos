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
import { HeldSaleDocParamsId } from '../constants/held-sale.doc.constant';
import { HeldSaleCreateDto } from '../dtos/held-sale.create.dto';
import { HeldSaleUpdateDto } from '../dtos/held-sale.update.dto';
import { HeldSaleGetSerialization } from '../serializations/held-sale.get.serialization';
import { HeldSaleListSerialization } from '../serializations/held-sale.list.serialization';

export function HeldSaleListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all held-sale' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<HeldSaleListSerialization>('heldSale.list', {
      serialization: HeldSaleListSerialization,
    }),
  );
}

export function HeldSaleGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of held-sale' }),
    DocRequest({ params: HeldSaleDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<HeldSaleGetSerialization>('heldSale.get', {
      serialization: HeldSaleGetSerialization,
    }),
  );
}

export function HeldSaleCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create held-sale' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: HeldSaleCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('heldSale.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function HeldSaleUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update held-sale' }),
    DocRequest({
      params: HeldSaleDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: HeldSaleUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('heldSale.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function HeldSaleInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make held-sale inactive' }),
    DocRequest({ params: HeldSaleDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('heldSale.inactive'),
  );
}

export function HeldSaleActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make held-sale active' }),
    DocRequest({ params: HeldSaleDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('heldSale.active'),
  );
}

export function HeldSaleDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'heldSale.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: HeldSaleDocParamsId }),
    DocResponse('heldSale.delete'),
  );
}
