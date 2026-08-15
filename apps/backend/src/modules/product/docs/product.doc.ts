import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocRequestFile,
  DocResponse,
  DocResponseFile,
  DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { ENUM_FILE_EXCEL_MIME } from 'src/common/file/constants/file.enum.constant';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { ProductDocParamsId } from '../constants/product.doc.constant';
import { ProductCreateDto } from '../dtos/product.create.dto';
import { ProductUpdateDto } from '../dtos/product.update.dto';
import { ProductGetSerialization } from '../serializations/product.get.serialization';
import { ProductImportSerialization } from '../serializations/product.import.serialization';
import { ProductListSerialization } from '../serializations/product.list.serialization';

export function ProductListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all product' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<ProductListSerialization>('product.list', {
      serialization: ProductListSerialization,
    }),
  );
}

export function ProductGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of product' }),
    DocRequest({ params: ProductDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ProductGetSerialization>('product.get', {
      serialization: ProductGetSerialization,
    }),
  );
}

export function ProductCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create product' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ProductCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('product.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ProductUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update product' }),
    DocRequest({
      params: ProductDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ProductUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('product.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ProductInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make product inactive' }),
    DocRequest({ params: ProductDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('product.inactive'),
  );
}

export function ProductActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make product active' }),
    DocRequest({ params: ProductDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('product.active'),
  );
}

export function ProductDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'product.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: ProductDocParamsId }),
    DocResponse('product.delete'),
  );
}

export function ProductImportDoc(includeTenantQuery = false): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'import products from excel or csv',
    }),
    DocAuth({ jwtAccessToken: true }),
    DocRequestFile({
      file: { multiple: false },
      queries: includeTenantQuery
        ? [
            {
              name: 'tenantId',
              required: true,
              description: 'Tenant to import products into',
              type: 'string',
            },
          ]
        : undefined,
    }),
    DocResponse<ProductImportSerialization>('product.import', {
      serialization: ProductImportSerialization,
    }),
  );
}

export function ProductImportTemplateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'download product import csv template' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponseFile({
      fileType: ENUM_FILE_EXCEL_MIME.CSV,
    }),
  );
}
