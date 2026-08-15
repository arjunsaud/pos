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
import { DocumentDocParamsId } from '../constants/document.doc.constant';
import { DocumentCreateDto } from '../dtos/document.create.dto';
import { DocumentUpdateDto } from '../dtos/document.update.dto';
import { DocumentGetSerialization } from '../serializations/document.get.serialization';
import { DocumentListSerialization } from '../serializations/document.list.serialization';

export function DocumentListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all document' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<DocumentListSerialization>('document.list', {
      serialization: DocumentListSerialization,
    }),
  );
}

export function DocumentGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of document' }),
    DocRequest({ params: DocumentDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<DocumentGetSerialization>('document.get', {
      serialization: DocumentGetSerialization,
    }),
  );
}

export function DocumentCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create document' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: DocumentCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('document.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function DocumentUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update document' }),
    DocRequest({
      params: DocumentDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: DocumentUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('document.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function DocumentInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make document inactive' }),
    DocRequest({ params: DocumentDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('document.inactive'),
  );
}

export function DocumentActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make document active' }),
    DocRequest({ params: DocumentDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('document.active'),
  );
}

export function DocumentDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'document.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: DocumentDocParamsId }),
    DocResponse('document.delete'),
  );
}
