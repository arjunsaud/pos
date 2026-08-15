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
import { VendorDocParamsId } from '../constants/vendor.doc.constant';
import { VendorCreateDto } from '../dtos/vendor.create.dto';
import { VendorUpdateDto } from '../dtos/vendor.update.dto';
import { VendorGetSerialization } from '../serializations/vendor.get.serialization';
import { VendorListSerialization } from '../serializations/vendor.list.serialization';

export function VendorListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all vendor' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<VendorListSerialization>('vendor.list', {
      serialization: VendorListSerialization,
    }),
  );
}

export function VendorGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of vendor' }),
    DocRequest({ params: VendorDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<VendorGetSerialization>('vendor.get', {
      serialization: VendorGetSerialization,
    }),
  );
}

export function VendorCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create vendor' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: VendorCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('vendor.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function VendorUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update vendor' }),
    DocRequest({
      params: VendorDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: VendorUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('vendor.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function VendorInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make vendor inactive' }),
    DocRequest({ params: VendorDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('vendor.inactive'),
  );
}

export function VendorActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make vendor active' }),
    DocRequest({ params: VendorDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('vendor.active'),
  );
}

export function VendorDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'vendor.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: VendorDocParamsId }),
    DocResponse('vendor.delete'),
  );
}
