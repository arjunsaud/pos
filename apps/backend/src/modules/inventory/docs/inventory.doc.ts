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
import { InventoryDocParamsId } from '../constants/inventory.doc.constant';
import { InventoryCreateDto } from '../dtos/inventory.create.dto';
import { InventoryUpdateDto } from '../dtos/inventory.update.dto';
import { InventoryGetSerialization } from '../serializations/inventory.get.serialization';
import { InventoryListSerialization } from '../serializations/inventory.list.serialization';

export function InventoryListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all inventory' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<InventoryListSerialization>('inventory.list', {
      serialization: InventoryListSerialization,
    }),
  );
}

export function InventoryGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of inventory' }),
    DocRequest({ params: InventoryDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<InventoryGetSerialization>('inventory.get', {
      serialization: InventoryGetSerialization,
    }),
  );
}

export function InventoryCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create inventory' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: InventoryCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('inventory.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function InventoryUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update inventory' }),
    DocRequest({
      params: InventoryDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: InventoryUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('inventory.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function InventoryInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make inventory inactive' }),
    DocRequest({ params: InventoryDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('inventory.inactive'),
  );
}

export function InventoryActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make inventory active' }),
    DocRequest({ params: InventoryDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('inventory.active'),
  );
}

export function InventoryDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'inventory.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: InventoryDocParamsId }),
    DocResponse('inventory.delete'),
  );
}
