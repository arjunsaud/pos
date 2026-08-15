import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ENUM_ADMIN_STATUS_CODE_ERROR } from 'src/modules/admin/constants/admin.status-code.constant';
import { AdminDoc } from 'src/modules/admin/repository/entities/admin.entity';

@Injectable()
export class AdminNotFoundGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __user } = context
      .switchToHttp()
      .getRequest<IRequestApp & { __user: AdminDoc }>();

    if (!__user) {
      throw new NotFoundException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_NOT_FOUND_ERROR,
        message: 'admin.error.notFound',
      });
    }

    return true;
  }
}
