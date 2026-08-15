import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ACCOUNT_KIND } from 'src/common/enum/user.status.enum';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AdminDoc } from 'src/modules/admin/repository/entities/admin.entity';
import { AdminService } from 'src/modules/admin/services/admin.service';

@Injectable()
export class AdminPayloadPutToRequestGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp & { __user: AdminDoc; user?: any }>();
    const payload = request.user;
    if (payload?.kind !== ACCOUNT_KIND.SUPERADMIN) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }
    const check: AdminDoc = await this.adminService.findOneById(
      payload?.user?._id,
    );
    request.__user = check;
    return true;
  }
}
