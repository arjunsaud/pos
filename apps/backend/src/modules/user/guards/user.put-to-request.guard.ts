import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp & { __user: UserDoc }>();
    const { params } = request;
    const { user } = params;

    const check: UserDoc = await this.userService.findOneById(user);
    request.__user = check;

    return true;
  }
}
