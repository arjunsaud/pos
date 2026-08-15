import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
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
  GetUser,
  UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import {
  USER_DEFAULT_AVAILABLE_ORDER_BY,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_ORDER_BY,
  USER_DEFAULT_ORDER_DIRECTION,
  USER_DEFAULT_PER_PAGE,
} from 'src/modules/user/constants/user.list.constant';
import { StaffRequestDto } from 'src/modules/user/dtos/staff.request.dto';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserStaffUpdateDto } from 'src/modules/user/dtos/user.staff-update.dto';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@ApiTags('Staff')
@Controller({
  version: '1',
  path: '/staff',
})
export class UserStaffController {
  constructor(
    private readonly authService: AuthService,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}

  @ResponsePaging('staff.list')
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      USER_DEFAULT_PER_PAGE,
      USER_DEFAULT_ORDER_BY,
      USER_DEFAULT_ORDER_DIRECTION,
      USER_DEFAULT_AVAILABLE_SEARCH,
      USER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs = await this.userService.findAll(find, {
      paging: { limit: _limit, offset: _offset },
      order: _order,
    });
    const total = await this.userService.getTotal(find);
    const totalPage = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @ResponseSingle('staff.get')
  @UserProtected()
  @RequestParamGuard(StaffRequestDto)
  @Get('/get/:staff')
  async get(@Param('staff') id: string): Promise<IResponse> {
    const doc = await this.userService.findOneById(id);
    return { data: doc };
  }

  @ResponseSingle('staff.create')
  @UserProtected()
  @Post('/create')
  async create(
    @GetUser() user: UserDoc,
    @Body() body: UserCreateDto,
  ): Promise<IResponse> {
    const emailExist = await this.userService.existByEmail(body.email);
    if (emailExist) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'user.error.emailExist',
      });
    }

    const password: IAuthPassword = await this.authService.createPassword(
      body.password,
    );
    const created = await this.userService.create(
      {
        ...body,
        tenantId: String(user.tenantId || body.tenantId || ''),
        tenantName: user.tenantName || body.tenantName,
        tenantStaffRole: body.tenantStaffRole || 'cashier',
      },
      password,
    );

    return { data: { _id: created._id } };
  }

  @ResponseSingle('staff.update')
  @UserProtected()
  @RequestParamGuard(StaffRequestDto)
  @Patch('/update/:staff')
  async update(
    @Param('staff') id: string,
    @Body() body: UserStaffUpdateDto,
  ): Promise<IResponse> {
    const doc = await this.userService.findOneById<UserDoc>(id);
    await this.userService.updateStaff(doc, body);
    return { data: { _id: doc._id } };
  }

  @ResponseSingle('staff.inactive')
  @UserProtected()
  @RequestParamGuard(StaffRequestDto)
  @Patch('/update/inactive/:staff')
  async inactive(@Param('staff') id: string): Promise<IResponse> {
    const doc = await this.userService.findOneById<UserDoc>(id);
    await this.userService.inactive(doc);
    return { data: { _id: doc._id } };
  }

  @ResponseSingle('staff.active')
  @UserProtected()
  @RequestParamGuard(StaffRequestDto)
  @Patch('/update/active/:staff')
  async active(@Param('staff') id: string): Promise<IResponse> {
    const doc = await this.userService.findOneById<UserDoc>(id);
    await this.userService.active(doc);
    return { data: { _id: doc._id } };
  }

  @ResponseSingle('staff.delete')
  @UserProtected()
  @RequestParamGuard(StaffRequestDto)
  @Delete('/delete/:staff')
  async delete(@Param('staff') id: string): Promise<IResponse> {
    const doc = await this.userService.findOneById<UserDoc>(id);
    await this.userService.delete(doc);
    return { data: { _id: doc._id } };
  }
}
