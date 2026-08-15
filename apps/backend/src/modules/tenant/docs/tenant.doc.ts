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
import { TenantDocParamsId } from '../constants/tenant.doc.constant';
import { TenantCreateDto } from '../dtos/tenant.create.dto';
import { TenantUpdateDto } from '../dtos/tenant.update.dto';
import { TenantGetSerialization } from '../serializations/tenant.get.serialization';
import { TenantListSerialization } from '../serializations/tenant.list.serialization';

export function TenantListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all tenant' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<TenantListSerialization>('tenant.list', {
      serialization: TenantListSerialization,
    }),
  );
}

export function TenantGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of tenant' }),
    DocRequest({ params: TenantDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<TenantGetSerialization>('tenant.get', {
      serialization: TenantGetSerialization,
    }),
  );
}

export function TenantCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create tenant' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: TenantCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('tenant.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function TenantUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update tenant' }),
    DocRequest({
      params: TenantDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: TenantUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('tenant.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function TenantInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make tenant inactive' }),
    DocRequest({ params: TenantDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('tenant.inactive'),
  );
}

export function TenantActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make tenant active' }),
    DocRequest({ params: TenantDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('tenant.active'),
  );
}

export function TenantDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'tenant.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: TenantDocParamsId }),
    DocResponse('tenant.delete'),
  );
}
