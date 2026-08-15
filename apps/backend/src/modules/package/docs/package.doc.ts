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
import { PackageDocParamsId } from '../constants/package.doc.constant';
import { PackageCreateDto } from '../dtos/package.create.dto';
import { PackageUpdateDto } from '../dtos/package.update.dto';
import { PackageGetSerialization } from '../serializations/package.get.serialization';
import { PackageListSerialization } from '../serializations/package.list.serialization';

export function PackageListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all package' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<PackageListSerialization>('package.list', {
      serialization: PackageListSerialization,
    }),
  );
}

export function PackageGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of package' }),
    DocRequest({ params: PackageDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<PackageGetSerialization>('package.get', {
      serialization: PackageGetSerialization,
    }),
  );
}

export function PackageCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create package' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PackageCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('package.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PackageUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update package' }),
    DocRequest({
      params: PackageDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: PackageUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('package.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function PackageInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make package inactive' }),
    DocRequest({ params: PackageDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('package.inactive'),
  );
}

export function PackageActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make package active' }),
    DocRequest({ params: PackageDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('package.active'),
  );
}

export function PackageDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'package.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: PackageDocParamsId }),
    DocResponse('package.delete'),
  );
}
