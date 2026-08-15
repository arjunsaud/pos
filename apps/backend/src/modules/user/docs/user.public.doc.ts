import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocResponse,
} from 'src/common/doc/decorators/doc.decorator';

export function UserSignUpDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'sign up a user',
    }),
    DocAuth({
      apiKey: true,
    }),
    DocResponse('user.signUp', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}
