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
import { ReturnRefundDocParamsId } from '../constants/return-refund.doc.constant';
import { ReturnRefundCreateDto } from '../dtos/return-refund.create.dto';
import { ReturnRefundUpdateDto } from '../dtos/return-refund.update.dto';
import { ReturnRefundGetSerialization } from '../serializations/return-refund.get.serialization';
import { ReturnRefundListSerialization } from '../serializations/return-refund.list.serialization';

export function ReturnRefundListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all return-refund' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<ReturnRefundListSerialization>('returnRefund.list', {
      serialization: ReturnRefundListSerialization,
    }),
  );
}

export function ReturnRefundGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of return-refund' }),
    DocRequest({ params: ReturnRefundDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ReturnRefundGetSerialization>('returnRefund.get', {
      serialization: ReturnRefundGetSerialization,
    }),
  );
}

export function ReturnRefundCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create return-refund' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ReturnRefundCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('returnRefund.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ReturnRefundUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update return-refund' }),
    DocRequest({
      params: ReturnRefundDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ReturnRefundUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('returnRefund.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ReturnRefundInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make return-refund inactive' }),
    DocRequest({ params: ReturnRefundDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('returnRefund.inactive'),
  );
}

export function ReturnRefundActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make return-refund active' }),
    DocRequest({ params: ReturnRefundDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('returnRefund.active'),
  );
}

export function ReturnRefundDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'returnRefund.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: ReturnRefundDocParamsId }),
    DocResponse('returnRefund.delete'),
  );
}
