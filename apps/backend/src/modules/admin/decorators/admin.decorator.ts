import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminActiveGuard } from 'src/modules/admin/guards/admin.active.guard';
import { AdminBlockedGuard } from 'src/modules/admin/guards/admin.blocked.guard';
import { AdminCanNotOurSelfGuard } from 'src/modules/admin/guards/admin.can-not-ourself.guard';
import { AdminInactivePermanentGuard } from 'src/modules/admin/guards/admin.inactive-permanent.guard';
import { AdminNotFoundGuard } from 'src/modules/admin/guards/admin.not-found.guard';
import { AdminPutToRequestGuard } from 'src/modules/admin/guards/admin.put-to-request.guard';
import {
  ADMIN_ACTIVE_META_KEY,
  ADMIN_BLOCKED_META_KEY,
  ADMIN_INACTIVE_PERMANENT_META_KEY,
} from '../constants/admin.constant';

export function AdminAdminGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(AdminPutToRequestGuard, AdminNotFoundGuard));
}

export function AdminAdminDeleteGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(
      AdminPutToRequestGuard,
      AdminNotFoundGuard,
      AdminCanNotOurSelfGuard,
    ),
  );
}

export function AdminAdminUpdateGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(
      AdminPutToRequestGuard,
      AdminNotFoundGuard,
      AdminCanNotOurSelfGuard,
    ),
  );
}

export function AdminAdminUpdateInactiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(
      AdminPutToRequestGuard,
      AdminNotFoundGuard,
      AdminCanNotOurSelfGuard,
      AdminBlockedGuard,
      AdminInactivePermanentGuard,
      AdminActiveGuard,
    ),
    SetMetadata(ADMIN_INACTIVE_PERMANENT_META_KEY, [false]),
    SetMetadata(ADMIN_ACTIVE_META_KEY, [true]),
    SetMetadata(ADMIN_BLOCKED_META_KEY, [false]),
  );
}

export function AdminAdminUpdateActiveGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(
      AdminPutToRequestGuard,
      AdminNotFoundGuard,
      AdminCanNotOurSelfGuard,
      AdminBlockedGuard,
      AdminInactivePermanentGuard,
      AdminActiveGuard,
    ),
    SetMetadata(ADMIN_INACTIVE_PERMANENT_META_KEY, [false]),
    SetMetadata(ADMIN_ACTIVE_META_KEY, [false]),
    SetMetadata(ADMIN_BLOCKED_META_KEY, [false]),
  );
}

export function AdminAdminUpdateBlockedGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(
      AdminPutToRequestGuard,
      AdminNotFoundGuard,
      AdminCanNotOurSelfGuard,
      AdminBlockedGuard,
    ),
    SetMetadata(ADMIN_BLOCKED_META_KEY, [false]),
  );
}
