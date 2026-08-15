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
import { StockTransferDocParamsId } from '../constants/stock-transfer.doc.constant';
import { StockTransferCreateDto } from '../dtos/stock-transfer.create.dto';
import { StockTransferUpdateDto } from '../dtos/stock-transfer.update.dto';
import { StockTransferGetSerialization } from '../serializations/stock-transfer.get.serialization';
import { StockTransferListSerialization } from '../serializations/stock-transfer.list.serialization';

export function StockTransferListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all stock-transfer' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<StockTransferListSerialization>('stockTransfer.list', {
      serialization: StockTransferListSerialization,
    }),
  );
}

export function StockTransferGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of stock-transfer' }),
    DocRequest({ params: StockTransferDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<StockTransferGetSerialization>('stockTransfer.get', {
      serialization: StockTransferGetSerialization,
    }),
  );
}

export function StockTransferCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create stock-transfer' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: StockTransferCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('stockTransfer.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function StockTransferUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update stock-transfer' }),
    DocRequest({
      params: StockTransferDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: StockTransferUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('stockTransfer.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function StockTransferInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make stock-transfer inactive' }),
    DocRequest({ params: StockTransferDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('stockTransfer.inactive'),
  );
}

export function StockTransferActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make stock-transfer active' }),
    DocRequest({ params: StockTransferDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('stockTransfer.active'),
  );
}

export function StockTransferDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'stockTransfer.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: StockTransferDocParamsId }),
    DocResponse('stockTransfer.delete'),
  );
}
