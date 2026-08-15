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
import { PromotionDocParamsId } from '../constants/promotion.doc.constant';
import { PromotionCreateDto } from '../dtos/promotion.create.dto';
import { PromotionUpdateDto } from '../dtos/promotion.update.dto';
import { PromotionGetSerialization } from '../serializations/promotion.get.serialization';
import { PromotionListSerialization } from '../serializations/promotion.list.serialization';

export function PromotionListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all promotion' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<PromotionListSerialization>('promotion.list', {
      serialization: PromotionListSerialization,
    }),
  );
}

export function PromotionGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of promotion' }),
    DocRequest({ params: PromotionDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<PromotionGetSerialization>('promotion.get', {
      serialization: PromotionGetSerialization,
    }),
  );
}

export function PromotionCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create promotion' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PromotionCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('promotion.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PromotionUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update promotion' }),
    DocRequest({
      params: PromotionDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PromotionUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('promotion.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PromotionInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make promotion inactive' }),
    DocRequest({ params: PromotionDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('promotion.inactive'),
  );
}

export function PromotionActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make promotion active' }),
    DocRequest({ params: PromotionDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('promotion.active'),
  );
}

export function PromotionDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'promotion.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: PromotionDocParamsId }),
    DocResponse('promotion.delete'),
  );
}
