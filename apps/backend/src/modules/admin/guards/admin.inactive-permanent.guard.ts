import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_INACTIVE_PERMANENT_META_KEY } from 'src/modules/admin/constants/admin.constant';

@Injectable()
export class AdminInactivePermanentGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
      ADMIN_INACTIVE_PERMANENT_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    // const { __admin } = context
    //   .switchToHttp()
    //   .getRequest<IRequestApp & { __admin: AdminDoc }>();

    // if (!required.includes(__admin.inactivePermanent)) {
    //   throw new BadRequestException({
    //     statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_INACTIVE_ERROR,
    //     message: 'admin.error.inactivePermanent',
    //   });
    // }
    return true;
  }
}
