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
import { FeatureDocParamsId } from '../constants/feature.doc.constant';
import { FeatureCreateDto } from '../dtos/feature.create.dto';
import { FeatureUpdateDto } from '../dtos/feature.update.dto';
import { FeatureGetSerialization } from '../serializations/feature.get.serialization';
import { FeatureListSerialization } from '../serializations/feature.list.serialization';

export function FeatureListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all feature' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<FeatureListSerialization>('feature.list', {
      serialization: FeatureListSerialization,
    }),
  );
}

export function FeatureGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of feature' }),
    DocRequest({ params: FeatureDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<FeatureGetSerialization>('feature.get', {
      serialization: FeatureGetSerialization,
    }),
  );
}

export function FeatureCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create feature' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: FeatureCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('feature.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function FeatureUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update feature' }),
    DocRequest({
      params: FeatureDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: FeatureUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('feature.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function FeatureInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make feature inactive' }),
    DocRequest({ params: FeatureDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('feature.inactive'),
  );
}

export function FeatureActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make feature active' }),
    DocRequest({ params: FeatureDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('feature.active'),
  );
}

export function FeatureDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'feature.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: FeatureDocParamsId }),
    DocResponse('feature.delete'),
  );
}
