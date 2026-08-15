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
import { NotificationDocParamsId } from '../constants/notification.doc.constant';
import { NotificationCreateDto } from '../dtos/notification.create.dto';
import { NotificationUpdateDto } from '../dtos/notification.update.dto';
import { NotificationGetSerialization } from '../serializations/notification.get.serialization';
import { NotificationListSerialization } from '../serializations/notification.list.serialization';

export function NotificationListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all notification' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<NotificationListSerialization>('notification.list', {
      serialization: NotificationListSerialization,
    }),
  );
}

export function NotificationGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of notification' }),
    DocRequest({ params: NotificationDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<NotificationGetSerialization>('notification.get', {
      serialization: NotificationGetSerialization,
    }),
  );
}

export function NotificationCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create notification' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: NotificationCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('notification.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function NotificationUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update notification' }),
    DocRequest({
      params: NotificationDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: NotificationUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('notification.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function NotificationInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make notification inactive' }),
    DocRequest({ params: NotificationDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('notification.inactive'),
  );
}

export function NotificationActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make notification active' }),
    DocRequest({ params: NotificationDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('notification.active'),
  );
}

export function NotificationDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'notification.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: NotificationDocParamsId }),
    DocResponse('notification.delete'),
  );
}
