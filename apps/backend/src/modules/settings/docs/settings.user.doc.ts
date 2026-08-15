import { applyDecorators } from '@nestjs/common';

import { Doc, DocAuth } from 'src/common/doc/decorators/doc.decorator';

export function SettingsUserGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail',
    }),
    DocAuth({
      jwtAccessToken: false,
    }),
  );
}
