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
export class AdminCanNotOurSelfGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { __admin, admin }: any = context
      .switchToHttp()
      .getRequest<IRequestApp & { __admin: AdminDoc }>();

    if (__admin._id === admin.admin._id) {
      throw new NotFoundException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_NOT_FOUND_ERROR,
        message: 'admin.error.notFound',
      });
    }

    return true;
  }
}
