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
import { ActivityLogDocParamsId } from '../constants/activity-log.doc.constant';
import { ActivityLogCreateDto } from '../dtos/activity-log.create.dto';
import { ActivityLogUpdateDto } from '../dtos/activity-log.update.dto';
import { ActivityLogGetSerialization } from '../serializations/activity-log.get.serialization';
import { ActivityLogListSerialization } from '../serializations/activity-log.list.serialization';

export function ActivityLogListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all activity-log' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<ActivityLogListSerialization>('activityLog.list', {
      serialization: ActivityLogListSerialization,
    }),
  );
}

export function ActivityLogGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of activity-log' }),
    DocRequest({ params: ActivityLogDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ActivityLogGetSerialization>('activityLog.get', {
      serialization: ActivityLogGetSerialization,
    }),
  );
}

export function ActivityLogCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create activity-log' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ActivityLogCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('activityLog.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ActivityLogUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update activity-log' }),
    DocRequest({
      params: ActivityLogDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ActivityLogUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('activityLog.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ActivityLogInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make activity-log inactive' }),
    DocRequest({ params: ActivityLogDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('activityLog.inactive'),
  );
}

export function ActivityLogActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make activity-log active' }),
    DocRequest({ params: ActivityLogDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('activityLog.active'),
  );
}

export function ActivityLogDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'activityLog.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: ActivityLogDocParamsId }),
    DocResponse('activityLog.delete'),
  );
}
