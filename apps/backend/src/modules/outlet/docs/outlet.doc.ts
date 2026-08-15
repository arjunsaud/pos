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
import { OutletDocParamsId } from '../constants/outlet.doc.constant';
import { OutletCreateDto } from '../dtos/outlet.create.dto';
import { OutletUpdateDto } from '../dtos/outlet.update.dto';
import { OutletGetSerialization } from '../serializations/outlet.get.serialization';
import { OutletListSerialization } from '../serializations/outlet.list.serialization';

export function OutletListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all outlet' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<OutletListSerialization>('outlet.list', {
      serialization: OutletListSerialization,
    }),
  );
}

export function OutletGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of outlet' }),
    DocRequest({ params: OutletDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<OutletGetSerialization>('outlet.get', {
      serialization: OutletGetSerialization,
    }),
  );
}

export function OutletCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create outlet' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: OutletCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('outlet.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function OutletUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update outlet' }),
    DocRequest({
      params: OutletDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: OutletUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('outlet.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function OutletInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make outlet inactive' }),
    DocRequest({ params: OutletDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('outlet.inactive'),
  );
}

export function OutletActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make outlet active' }),
    DocRequest({ params: OutletDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('outlet.active'),
  );
}

export function OutletDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'outlet.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: OutletDocParamsId }),
    DocResponse('outlet.delete'),
  );
}
