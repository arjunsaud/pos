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
import { CategoryDocParamsId } from '../constants/category.doc.constant';
import { CategoryCreateDto } from '../dtos/category.create.dto';
import { CategoryUpdateDto } from '../dtos/category.update.dto';
import { CategoryGetSerialization } from '../serializations/category.get.serialization';
import { CategoryListSerialization } from '../serializations/category.list.serialization';

export function CategoryListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all category' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<CategoryListSerialization>('category.list', {
      serialization: CategoryListSerialization,
    }),
  );
}

export function CategoryGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of category' }),
    DocRequest({ params: CategoryDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<CategoryGetSerialization>('category.get', {
      serialization: CategoryGetSerialization,
    }),
  );
}

export function CategoryCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create category' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CategoryCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('category.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function CategoryUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update category' }),
    DocRequest({
      params: CategoryDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: CategoryUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('category.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function CategoryInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make category inactive' }),
    DocRequest({ params: CategoryDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('category.inactive'),
  );
}

export function CategoryActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make category active' }),
    DocRequest({ params: CategoryDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('category.active'),
  );
}

export function CategoryDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'category.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: CategoryDocParamsId }),
    DocResponse('category.delete'),
  );
}
