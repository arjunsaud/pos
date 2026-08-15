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
import { SupportTicketDocParamsId } from '../constants/support-ticket.doc.constant';
import { SupportTicketCreateDto } from '../dtos/support-ticket.create.dto';
import { SupportTicketUpdateDto } from '../dtos/support-ticket.update.dto';
import { SupportTicketGetSerialization } from '../serializations/support-ticket.get.serialization';
import { SupportTicketListSerialization } from '../serializations/support-ticket.list.serialization';

export function SupportTicketListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get all support-ticket' }),
    DocAuth({ jwtAccessToken: true }),
    DocResponsePaging<SupportTicketListSerialization>('supportTicket.list', {
      serialization: SupportTicketListSerialization,
    }),
  );
}

export function SupportTicketGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail of support-ticket' }),
    DocRequest({ params: SupportTicketDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<SupportTicketGetSerialization>('supportTicket.get', {
      serialization: SupportTicketGetSerialization,
    }),
  );
}

export function SupportTicketCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create support-ticket' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SupportTicketCreateDto,
    }),
    DocResponse<ResponseIdSerialization>('supportTicket.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function SupportTicketUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update support-ticket' }),
    DocRequest({
      params: SupportTicketDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: SupportTicketUpdateDto,
    }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse<ResponseIdSerialization>('supportTicket.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}

export function SupportTicketInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make support-ticket inactive' }),
    DocRequest({ params: SupportTicketDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('supportTicket.inactive'),
  );
}

export function SupportTicketActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'make support-ticket active' }),
    DocRequest({ params: SupportTicketDocParamsId }),
    DocAuth({ jwtAccessToken: true }),
    DocResponse('supportTicket.active'),
  );
}

export function SupportTicketDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ operation: 'supportTicket.delete' }),
    DocAuth({ jwtAccessToken: true }),
    DocRequest({ params: SupportTicketDocParamsId }),
    DocResponse('supportTicket.delete'),
  );
}
