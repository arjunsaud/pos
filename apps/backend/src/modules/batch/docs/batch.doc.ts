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
import { BatchDocParamsId } from '../constants/batch.doc.constant';
import { BatchCreateDto } from '../dtos/batch.create.dto';
import { BatchUpdateDto } from '../dtos/batch.update.dto';
import { BatchGetSerialization } from '../serializations/batch.get.serialization';
import { BatchListSerialization } from '../serializations/batch.list.serialization';

export function BatchListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all batch' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<BatchListSerialization>('batch.list', {
      serialization: BatchListSerialization,
    }),
  );
}

export function BatchGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of batch' }),
    DocRequest({ params: BatchDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<BatchGetSerialization>('batch.get', {
      serialization: BatchGetSerialization,
    }),
  );
}

export function BatchCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create batch' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: BatchCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('batch.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function BatchUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update batch' }),
    DocRequest({
      params: BatchDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: BatchUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('batch.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function BatchInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make batch inactive' }),
    DocRequest({ params: BatchDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('batch.inactive'),
  );
}

export function BatchActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make batch active' }),
    DocRequest({ params: BatchDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('batch.active'),
  );
}

export function BatchDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'batch.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: BatchDocParamsId }),
    DocResponse('batch.delete'),
  );
}
