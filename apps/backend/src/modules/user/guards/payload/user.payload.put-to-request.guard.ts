import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ACCOUNT_KIND } from 'src/common/enum/user.status.enum';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp & { __user: UserDoc; user?: any }>();
    const payload = request.user;
    if (payload?.kind !== ACCOUNT_KIND.TENANT) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }
    const check: UserDoc = await this.userService.findOneById(
      payload?.user?._id,
    );
    request.__user = check;
    return true;
  }
}
