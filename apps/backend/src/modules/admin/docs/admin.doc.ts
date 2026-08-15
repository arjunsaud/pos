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
  AdminDocParamsId,
  AdminDocQueryBlocked,
  AdminDocQueryInactivePermanent,
  AdminDocQueryIsActive,
  AdminDocQueryRole,
} from 'src/modules/admin/constants/admin.doc.constant';
import { AdminCreateDto } from 'src/modules/admin/dtos/admin.create.dto';
import { AdminUpdateNameDto } from 'src/modules/admin/dtos/admin.update-name.dto';

export function AdminAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of admins',
    }),
    DocRequest({
      queries: [
        ...AdminDocQueryIsActive,
        ...AdminDocQueryBlocked,
        ...AdminDocQueryInactivePermanent,
        ...AdminDocQueryRole,
      ],
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function AdminAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an admin',
    }),
    DocRequest({
      params: AdminDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function AdminAdminActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'make admin be active',
    }),
    DocRequest({
      params: AdminDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function AdminAdminInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'make admin be inactive',
    }),
    DocRequest({
      params: AdminDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function AdminAdminBlockedDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'block a admin',
    }),
    DocRequest({
      params: AdminDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function AdminAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a admin',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: AdminCreateDto,
    }),
  );
}

export function AdminAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update data a admin',
    }),
    DocRequest({
      params: AdminDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: AdminUpdateNameDto,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function AdminAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a admin',
    }),
    DocRequest({
      params: AdminDocParamsId,
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function AdminAdminImportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'import admins with excel',
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

export function AdminAdminExportDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'export admin into excel',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponseFile(),
  );
}
