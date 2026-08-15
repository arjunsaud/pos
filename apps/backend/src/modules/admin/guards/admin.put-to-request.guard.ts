import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { AdminDoc } from 'src/modules/admin/repository/entities/admin.entity';
import { AdminService } from 'src/modules/admin/services/admin.service';

@Injectable()
export class AdminPutToRequestGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp & { __admin: AdminDoc }>();
    const { params } = request;
    const { admin } = params;

    const check: AdminDoc = await this.adminService.findOneById(admin);
    request.__admin = check;

    return true;
  }
}
