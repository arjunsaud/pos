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
import { ReferralDocParamsId } from '../constants/referral.doc.constant';
import { ReferralCreateDto } from '../dtos/referral.create.dto';
import { ReferralUpdateDto } from '../dtos/referral.update.dto';
import { ReferralGetSerialization } from '../serializations/referral.get.serialization';
import { ReferralListSerialization } from '../serializations/referral.list.serialization';

export function ReferralListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all referral' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<ReferralListSerialization>('referral.list', {
      serialization: ReferralListSerialization,
    }),
  );
}

export function ReferralGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of referral' }),
    DocRequest({ params: ReferralDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ReferralGetSerialization>('referral.get', {
      serialization: ReferralGetSerialization,
    }),
  );
}

export function ReferralCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create referral' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ReferralCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('referral.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ReferralUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update referral' }),
    DocRequest({
      params: ReferralDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ReferralUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('referral.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ReferralInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make referral inactive' }),
    DocRequest({ params: ReferralDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('referral.inactive'),
  );
}

export function ReferralActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make referral active' }),
    DocRequest({ params: ReferralDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('referral.active'),
  );
}

export function ReferralDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'referral.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: ReferralDocParamsId }),
    DocResponse('referral.delete'),
  );
}
