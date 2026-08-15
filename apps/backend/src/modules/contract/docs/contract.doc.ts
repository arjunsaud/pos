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
import { ContractDocParamsId } from '../constants/contract.doc.constant';
import { ContractCreateDto } from '../dtos/contract.create.dto';
import { ContractUpdateDto } from '../dtos/contract.update.dto';
import { ContractGetSerialization } from '../serializations/contract.get.serialization';
import { ContractListSerialization } from '../serializations/contract.list.serialization';

export function ContractListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all contract' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<ContractListSerialization>('contract.list', {
      serialization: ContractListSerialization,
    }),
  );
}

export function ContractGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of contract' }),
    DocRequest({ params: ContractDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ContractGetSerialization>('contract.get', {
      serialization: ContractGetSerialization,
    }),
  );
}

export function ContractCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create contract' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ContractCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('contract.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ContractUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update contract' }),
    DocRequest({
      params: ContractDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: ContractUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('contract.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function ContractInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make contract inactive' }),
    DocRequest({ params: ContractDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('contract.inactive'),
  );
}

export function ContractActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make contract active' }),
    DocRequest({ params: ContractDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('contract.active'),
  );
}

export function ContractDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'contract.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: ContractDocParamsId }),
    DocResponse('contract.delete'),
  );
}
