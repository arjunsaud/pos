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
import { StockMovementDocParamsId } from '../constants/stock-movement.doc.constant';
import { StockMovementCreateDto } from '../dtos/stock-movement.create.dto';
import { StockMovementUpdateDto } from '../dtos/stock-movement.update.dto';
import { StockMovementGetSerialization } from '../serializations/stock-movement.get.serialization';
import { StockMovementListSerialization } from '../serializations/stock-movement.list.serialization';

export function StockMovementListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all stock-movement' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<StockMovementListSerialization>('stockMovement.list', {
      serialization: StockMovementListSerialization,
    }),
  );
}

export function StockMovementGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of stock-movement' }),
    DocRequest({ params: StockMovementDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<StockMovementGetSerialization>('stockMovement.get', {
      serialization: StockMovementGetSerialization,
    }),
  );
}

export function StockMovementCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create stock-movement' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: StockMovementCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('stockMovement.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function StockMovementUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update stock-movement' }),
    DocRequest({
      params: StockMovementDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: StockMovementUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('stockMovement.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function StockMovementInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make stock-movement inactive' }),
    DocRequest({ params: StockMovementDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('stockMovement.inactive'),
  );
}

export function StockMovementActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make stock-movement active' }),
    DocRequest({ params: StockMovementDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('stockMovement.active'),
  );
}

export function StockMovementDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'stockMovement.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: StockMovementDocParamsId }),
    DocResponse('stockMovement.delete'),
  );
}
