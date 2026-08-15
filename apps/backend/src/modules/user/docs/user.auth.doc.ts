import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocAuth,
  DocRequest,
} from 'src/common/doc/decorators/doc.decorator';
import { UserChangePasswordDto } from 'src/modules/user/dtos/user.change-password.dto';
import { UserLoginDto } from 'src/modules/user/dtos/user.login.dto';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
import { UserUpdateUsernameDto } from 'src/modules/user/dtos/user.update-username.dto';
export function UserAuthLoginDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'login with email and password',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UserLoginDto,
    }),
    DocAuth({ apiKey: true }),
  );
}

export function UserAuthLoginGoogleDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'login with access token google',
    }),
    DocAuth({ google: true, apiKey: true }),
  );
}

export function UserAuthRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'refresh a token',
    }),
    DocAuth({ apiKey: true, jwtRefreshToken: true }),
  );
}

export function UserAuthProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get profile',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAuthUpdateProfileDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update profile',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UserUpdateNameDto,
    }),
  );
}

export function UserAuthInfoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get info of access token',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAuthChangePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'change password',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UserChangePasswordDto,
    }),
  );
}

export function UserAuthClaimUsernameDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'claim username',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UserUpdateUsernameDto,
    }),
  );
}
