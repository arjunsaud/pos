import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocAuth,
  DocRequest,
} from 'src/common/doc/decorators/doc.decorator';
import { AdminChangePasswordDto } from 'src/modules/admin/dtos/admin.change-password.dto';
import { AdminLoginDto } from 'src/modules/admin/dtos/admin.login.dto';
import { AdminUpdateNameDto } from 'src/modules/admin/dtos/admin.update-name.dto';

export function AdminAuthLoginDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'login with email and password',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: AdminLoginDto,
    }),
    DocAuth({ apiKey: true }),
  );
}

export function AdminAuthLoginGoogleDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'login with access token google',
    }),
    DocAuth({ google: true, apiKey: true }),
  );
}

export function AdminAuthRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'refresh a token',
    }),
    DocAuth({ apiKey: true, jwtRefreshToken: true }),
  );
}

export function AdminAuthProfileDoc(): MethodDecorator {
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

export function AdminAuthUpdateProfileDoc(): MethodDecorator {
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
      body: AdminUpdateNameDto,
    }),
  );
}

export function AdminAuthInfoDoc(): MethodDecorator {
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

export function AdminAuthChangePasswordDoc(): MethodDecorator {
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
      body: AdminChangePasswordDto,
    }),
  );
}
