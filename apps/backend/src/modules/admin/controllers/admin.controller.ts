import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
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
  ADMIN_DEFAULT_AVAILABLE_ORDER_BY,
  ADMIN_DEFAULT_AVAILABLE_SEARCH,
  ADMIN_DEFAULT_BLOCKED,
  ADMIN_DEFAULT_INACTIVE_PERMANENT,
  ADMIN_DEFAULT_IS_ACTIVE,
  ADMIN_DEFAULT_ORDER_BY,
  ADMIN_DEFAULT_ORDER_DIRECTION,
  ADMIN_DEFAULT_PER_PAGE,
} from '../constants/admin.list.constant';
import { ENUM_ADMIN_STATUS_CODE_ERROR } from '../constants/admin.status-code.constant';
import {
  AdminAdminDeleteGuard,
  AdminAdminUpdateActiveGuard,
  AdminAdminUpdateInactiveGuard,
} from '../decorators/admin.decorator';
import { AdminProtected, GetAdmin } from '../decorators/admin.user.decorator';
import {
  AdminAdminActiveDoc,
  AdminAdminDeleteDoc,
  AdminAdminGetDoc,
  AdminAdminInactiveDoc,
  AdminAdminListDoc,
  AdminAdminUpdateDoc,
} from '../docs/admin.doc';
import { AdminCreateDto } from '../dtos/admin.create.dto';
import { AdminRequestDto } from '../dtos/admin.request.dto';
import { AdminUpdateNameDto } from '../dtos/admin.update-name.dto';
import { IAdminDoc, IAdminEntity } from '../interfaces/admin.interface';
import { AdminDoc } from '../repository/entities/admin.entity';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin')
@Controller({
  version: '1',
  path: '/admin',
})
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly paginationService: PaginationService,
    private readonly adminService: AdminService,
  ) {}

  @AdminAdminListDoc()
  @ResponsePaging('admin.list')
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      ADMIN_DEFAULT_PER_PAGE,
      ADMIN_DEFAULT_ORDER_BY,
      ADMIN_DEFAULT_ORDER_DIRECTION,
      ADMIN_DEFAULT_AVAILABLE_SEARCH,
      ADMIN_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', ADMIN_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>,
    @PaginationQueryFilterInBoolean('blocked', ADMIN_DEFAULT_BLOCKED)
    blocked: Record<string, any>,
    @PaginationQueryFilterInBoolean(
      'inactivePermanent',
      ADMIN_DEFAULT_INACTIVE_PERMANENT,
    )
    inactivePermanent: Record<string, any>,
    @PaginationQueryFilterEqualObjectId('role')
    role: Record<string, any>,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
      ...blocked,
      ...inactivePermanent,
      ...role,
    };

    const admins: IAdminEntity[] = await this.adminService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this.adminService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: admins,
    };
  }

  @AdminAdminGetDoc()
  @ResponseSingle('admin.get')
  @RequestParamGuard(AdminRequestDto)
  @Get('/get/:admin')
  async get(@GetAdmin() admin: AdminDoc): Promise<IResponse> {
    const adminDoc: IAdminDoc = await this.adminService.findOneById(
      admin?._id?.toString(),
    );
    return { data: adminDoc };
  }

  @ResponseSingle('admin.create')
  @AdminProtected()
  @Post('/create')
  async create(
    @Body()
    { email, mobileNumber, ...body }: AdminCreateDto,
  ): Promise<IResponse> {
    const promises: Promise<any>[] = [this.adminService.existByEmail(email)];

    if (mobileNumber) {
      promises.push(this.adminService.existByMobileNumber(mobileNumber));
    }

    const [emailExist, mobileNumberExist] = await Promise.all(promises);

    if (emailExist) {
      throw new ConflictException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_EMAIL_EXIST_ERROR,
        message: 'admin.error.emailExist',
      });
    } else if (mobileNumberExist) {
      throw new ConflictException({
        statusCode:
          ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_MOBILE_NUMBER_EXIST_ERROR,
        message: 'admin.error.mobileNumberExist',
      });
    }

    const password: IAuthPassword = await this.authService.createPassword(
      body.password,
    );

    const created: AdminDoc = await this.adminService.create(
      {
        email,
        mobileNumber,
        ...body,
      },
      password,
    );

    return {
      data: { _id: created._id },
    };
  }

  @AdminAdminUpdateDoc()
  @ResponseSingle('admin.update')
  @AdminProtected()
  @RequestParamGuard(AdminRequestDto)
  @Patch('/update/:admin')
  async update(
    @GetAdmin() admin: AdminDoc,
    @Body()
    body: AdminUpdateNameDto,
  ): Promise<IResponse> {
    await this.adminService.update(admin, body);
    return {
      data: { _id: admin._id },
    };
  }

  @AdminAdminInactiveDoc()
  @ResponseSingle('admin.inactive')
  @AdminAdminUpdateInactiveGuard()
  @RequestParamGuard(AdminRequestDto)
  @Patch('/update/inactive/:admin')
  async inactive(@GetAdmin() admin: AdminDoc): Promise<IResponse> {
    const adminDocs = await this.adminService.inactive(admin);
    return { data: adminDocs?._id };
  }

  @AdminAdminActiveDoc()
  @ResponseSingle('admin.active')
  @AdminAdminUpdateActiveGuard()
  @RequestParamGuard(AdminRequestDto)
  @Patch('/update/active/:admin')
  async active(@GetAdmin() admin: AdminDoc): Promise<IResponse> {
    const adminDocs = await this.adminService.active(admin);

    return { data: adminDocs?._id };
  }

  @AdminAdminDeleteDoc()
  @ResponseSingle('admin.delete')
  @AdminAdminDeleteGuard()
  @RequestParamGuard(AdminRequestDto)
  @Delete('/delete/:admin')
  async delete(@GetAdmin() admin: AdminDoc): Promise<IResponse> {
    const adminDocs = await this.adminService.delete(admin);
    return { data: adminDocs?._id };
  }
}
