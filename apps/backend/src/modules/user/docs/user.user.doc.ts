import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
} from 'src/common/doc/decorators/doc.decorator';

export function UserDeleteSelfDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'user delete their account',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true }),
  );
}
