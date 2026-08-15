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
import { TemplateDocParamsId } from '../constants/template.doc.constant';
import { TemplateCreateDto } from '../dtos/template.create.dto';
import { TemplateUpdateDto } from '../dtos/template.update.dto';
import { TemplateGetSerialization } from '../serializations/template.get.serialization';
import { TemplateListSerialization } from '../serializations/template.list.serialization';

export function TemplateListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'list print templates' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<TemplateListSerialization>('template.list', {
      serialization: TemplateListSerialization,
    }),
  );
}

export function TemplateGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get a print template' }),
    DocRequest({ params: TemplateDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<TemplateGetSerialization>('template.get', {
      serialization: TemplateGetSerialization,
    }),
  );
}

export function TemplateCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create a print template' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: TemplateCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('template.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function TemplateUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update a print template' }),
    DocRequest({
      params: TemplateDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: TemplateUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('template.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function TemplateInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'deactivate a print template' }),
    DocRequest({ params: TemplateDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('template.inactive'),
  );
}

export function TemplateActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'activate a print template' }),
    DocRequest({ params: TemplateDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('template.active'),
  );
}

export function TemplateDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'template.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: TemplateDocParamsId }),
    DocResponse('template.delete'),
  );
}
