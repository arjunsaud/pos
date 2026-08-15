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
import { ContentDocParamsId } from '../constants/content.doc.constant';
import { ContentCreateDto } from '../dtos/content.create.dto';
import { ContentUpdateDto } from '../dtos/content.update.dto';
import { ContentGetSerialization } from '../serializations/content.get.serialization';
import { ContentListSerialization } from '../serializations/content.list.serialization';

export function ContentListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all content' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<ContentListSerialization>('content.list', {
      serialization: ContentListSerialization,
    }),
  );
}

export function ContentGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of content' }),
    DocRequest({ params: ContentDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ContentGetSerialization>('content.get', {
      serialization: ContentGetSerialization,
    }),
  );
}

export function ContentCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create content' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ContentCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('content.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ContentUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update content' }),
    DocRequest({
      params: ContentDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ContentUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('content.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ContentInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make content inactive' }),
    DocRequest({ params: ContentDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('content.inactive'),
  );
}

export function ContentActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make content active' }),
    DocRequest({ params: ContentDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('content.active'),
  );
}

export function ContentDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'content.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: ContentDocParamsId }),
    DocResponse('content.delete'),
  );
}
