import { applyDecorators } from '@nestjs/common';

import { DocQueryIsActive } from 'src/common/doc/constants/docQueryIsActive';
import {
  Doc,
  DocAuth,
  DocRequest,
} from 'src/common/doc/decorators/doc.decorator';
import { MailLogDocParamsGet } from '../constants/mail-log.doc.constants';

export function MailerListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'mailer',
    }),
    DocRequest({
      queries: [...DocQueryIsActive],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
  );
}

export function MailerGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an user',
    }),
    DocRequest({
      params: MailLogDocParamsGet,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function MailerDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'mail.delete',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      params: MailLogDocParamsGet,
    }),
  );
}
