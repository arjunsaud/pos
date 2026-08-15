import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthJwtAccessGuard } from 'src/common/auth/guards/jwt-access/auth.jwt-access.guard';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import {
  ADMIN_ACTIVE_META_KEY,
  ADMIN_BLOCKED_META_KEY,
  ADMIN_INACTIVE_PERMANENT_META_KEY,
} from 'src/modules/admin/constants/admin.constant';
import { AdminPayloadPutToRequestGuard } from 'src/modules/admin/guards/payload/admin.payload.put-to-request.guard';
import { AdminActiveGuard } from 'src/modules/admin/guards/admin.active.guard';
import { AdminBlockedGuard } from 'src/modules/admin/guards/admin.blocked.guard';
import { AdminInactivePermanentGuard } from 'src/modules/admin/guards/admin.inactive-permanent.guard';
import { AdminNotFoundGuard } from 'src/modules/admin/guards/admin.not-found.guard';
import { AdminDoc } from 'src/modules/admin/repository/entities/admin.entity';

export const GetAdmin = createParamDecorator(
  <T>(returnPlain: boolean, ctx: ExecutionContext): T => {
    const { __user } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { __user: AdminDoc }>();
    return (returnPlain ? __user.toObject() : __user) as T;
  },
);

export function AdminProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(
      AuthJwtAccessGuard,
      AdminPayloadPutToRequestGuard,
      AdminNotFoundGuard,
    ),
  );
}

export function AdminAuthProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(AdminBlockedGuard, AdminInactivePermanentGuard, AdminActiveGuard),
    SetMetadata(ADMIN_INACTIVE_PERMANENT_META_KEY, [false]),
    SetMetadata(ADMIN_BLOCKED_META_KEY, [false]),
    SetMetadata(ADMIN_ACTIVE_META_KEY, [true]),
  );
}
