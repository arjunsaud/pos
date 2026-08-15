import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocRequestFile,
  DocResponseFile,
} from 'src/common/doc/decorators/doc.decorator';
import { FileSingleDto } from 'src/common/file/dtos/file.single.dto';
import {
  UserDocParamsId,
  UserDocQueryBlocked,
  UserDocQueryInactivePermanent,
  UserDocQueryIsActive,
  UserDocQueryRole,
} from 'src/modules/user/constants/user.doc.constant';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
export function UserAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of users',
    }),
    DocRequest({
      queries: [
        ...UserDocQueryIsActive,
        ...UserDocQueryBlocked,
        ...UserDocQueryInactivePermanent,
        ...UserDocQueryRole,
      ],
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an user',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAdminActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'make user be active',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAdminInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'make user be inactive',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAdminBlockedDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'block a user',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a user',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UserCreateDto,
    }),
  );
}

export function UserAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update data a user',
    }),
    DocRequest({
      params: UserDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: UserUpdateNameDto,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a user',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function UserAdminImportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'import users with excel',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocRequestFile({
      body: FileSingleDto,
      file: {
        multiple: false,
      },
    }),
  );
}

export function UserAdminExportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'export user into excel',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseFile(),
  );
}
