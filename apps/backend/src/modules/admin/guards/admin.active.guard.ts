import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ADMIN_ACTIVE_META_KEY } from 'src/modules/admin/constants/admin.constant';
import { ENUM_ADMIN_STATUS_CODE_ERROR } from 'src/modules/admin/constants/admin.status-code.constant';
import { AdminDoc } from 'src/modules/admin/repository/entities/admin.entity';

@Injectable()
export class AdminActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
      ADMIN_ACTIVE_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    const { __admin } = context
      .switchToHttp()
      .getRequest<IRequestApp & { __admin: AdminDoc }>();

    if (!required.includes(__admin.isActive)) {
      throw new BadRequestException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_IS_ACTIVE_ERROR,
        message: 'admin.error.isActiveInvalid',
      });
    }
    return true;
  }
}
