import { Body, Controller, Delete, Get, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/common/auth/services/auth.service';
import {
  PaginationQuery,
  PaginationQueryFilterEqualObjectId,
  PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
  ResponsePaging,
  ResponseSingle,
} from 'src/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import {
  USER_DEFAULT_AVAILABLE_ORDER_BY,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_BLOCKED,
  USER_DEFAULT_INACTIVE_PERMANENT,
  USER_DEFAULT_IS_ACTIVE,
  USER_DEFAULT_ORDER_BY,
  USER_DEFAULT_ORDER_DIRECTION,
  USER_DEFAULT_PER_PAGE,
} from 'src/modules/user/constants/user.list.constant';
import {
  UserAdminDeleteGuard,
  UserAdminUpdateActiveGuard,
  UserAdminUpdateInactiveGuard,
} from 'src/modules/user/decorators/user.admin.decorator';
import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import {
  GetUser,
  UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import {
  UserAdminActiveDoc,
  UserAdminDeleteDoc,
  UserAdminGetDoc,
  UserAdminInactiveDoc,
  UserAdminListDoc,
  UserAdminUpdateDoc,
} from 'src/modules/user/docs/user.admin.doc';
import { UserRequestDto } from 'src/modules/user/dtos/user.request.dto';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
import {
  IUserDoc,
  IUserEntity,
} from 'src/modules/user/interfaces/user.interface';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@ApiTags('Users')
@Controller({
  version: '1',
  path: '/user',
})
export class UserAdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}

  @UserAdminListDoc()
  @ResponsePaging('user.list')
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      USER_DEFAULT_PER_PAGE,
      USER_DEFAULT_ORDER_BY,
      USER_DEFAULT_ORDER_DIRECTION,
      USER_DEFAULT_AVAILABLE_SEARCH,
      USER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', USER_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInBoolean('blocked', USER_DEFAULT_BLOCKED)
    blocked: Record<string, any>,
    @PaginationQueryFilterInBoolean(
      'inactivePermanent',
      USER_DEFAULT_INACTIVE_PERMANENT,
    )
    inactivePermanent: Record<string, any>,
    @PaginationQueryFilterEqualObjectId('role')
    role: Record<string, any>,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
      ...blocked,
      ...inactivePermanent,
      ...role,
      ...(tenantId ? { tenantId } : {}),
    };

    const users: IUserEntity[] = await this.userService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this.userService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: users,
    };
  }

  @UserAdminGetDoc()
  @ResponseSingle('user.get')
  @RequestParamGuard(UserRequestDto)
  @Get('/get/:user')
  async get(@GetUser() user: UserDoc): Promise<IResponse> {
    const userDoc: IUserDoc = await this.userService.findOneById(
      user?._id?.toString(),
    );
    return { data: userDoc };
  }

  @UserAdminUpdateDoc()
  @ResponseSingle('user.update')
  @UserProtected()
  @RequestParamGuard(UserRequestDto)
  @Patch('/update/:user')
  async update(
    @GetUser() user: UserDoc,
    @Body()
    body: UserUpdateNameDto,
  ): Promise<IResponse> {
    const userDoc = await this.userService.updateName(user, body);

    return {
      data: userDoc?._id,
    };
  }

  @UserAdminInactiveDoc()
  @ResponseSingle('user.inactive')
  @UserAdminUpdateInactiveGuard()
  @RequestParamGuard(UserRequestDto)
  @Patch('/update/inactive/:user')
  async inactive(@GetUser() user: UserDoc): Promise<IResponse> {
    const userDoc = await this.userService.inactive(user);
    return { data: userDoc?._id };
  }

  @UserAdminActiveDoc()
  @ResponseSingle('user.active')
  @UserAdminUpdateActiveGuard()
  @RequestParamGuard(UserRequestDto)
  @Patch('/update/active/:user')
  async active(@GetUser() user: UserDoc): Promise<IResponse> {
    const userDoc = await this.userService.active(user);

    return { data: userDoc?._id };
  }

  @UserAdminDeleteDoc()
  @ResponseSingle('user.delete')
  @UserAdminDeleteGuard()
  @RequestParamGuard(UserRequestDto)
  @Delete('/delete/:user')
  async delete(@GetUser() user: UserDoc): Promise<IResponse> {
    const userDoc = await this.userService.delete(user);

    return { data: userDoc?._id };
  }
}
