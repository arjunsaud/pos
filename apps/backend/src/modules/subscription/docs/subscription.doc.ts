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
import { SubscriptionDocParamsId } from '../constants/subscription.doc.constant';
import { SubscriptionCreateDto } from '../dtos/subscription.create.dto';
import { SubscriptionUpdateDto } from '../dtos/subscription.update.dto';
import { SubscriptionGetSerialization } from '../serializations/subscription.get.serialization';
import { SubscriptionListSerialization } from '../serializations/subscription.list.serialization';

export function SubscriptionListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all subscription' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<SubscriptionListSerialization>('subscription.list', {
      serialization: SubscriptionListSerialization,
    }),
  );
}

export function SubscriptionGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of subscription' }),
    DocRequest({ params: SubscriptionDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<SubscriptionGetSerialization>('subscription.get', {
      serialization: SubscriptionGetSerialization,
    }),
  );
}

export function SubscriptionCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create subscription' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SubscriptionCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('subscription.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function SubscriptionUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update subscription' }),
    DocRequest({
      params: SubscriptionDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SubscriptionUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('subscription.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function SubscriptionInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make subscription inactive' }),
    DocRequest({ params: SubscriptionDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('subscription.inactive'),
  );
}

export function SubscriptionActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make subscription active' }),
    DocRequest({ params: SubscriptionDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('subscription.active'),
  );
}

export function SubscriptionDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'subscription.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: SubscriptionDocParamsId }),
    DocResponse('subscription.delete'),
  );
}
