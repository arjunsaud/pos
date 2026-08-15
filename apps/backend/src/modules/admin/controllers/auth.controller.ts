import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientSession, Connection } from 'mongoose';
import { ACCOUNT_KIND } from 'src/common/enum/user.status.enum';
import {
  ENUM_AUTH_LOGIN_FROM,
  ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthAccessPayloadSerialization } from 'src/common/auth/serializations/auth.access-payload.serialization';
import { AuthRefreshPayloadSerialization } from 'src/common/auth/serializations/auth.refresh-payload.serialization';
import { AuthService } from 'src/common/auth/services/auth.service';
import { DatabaseConnection } from 'src/common/database/decorators/database.decorator';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ENUM_ADMIN_STATUS_CODE_ERROR } from 'src/modules/admin/constants/admin.status-code.constant';

import {
  AdminAuthProtected,
  AdminProtected,
  GetAdmin,
} from '../decorators/admin.user.decorator';
import {
  AdminAuthChangePasswordDoc,
  AdminAuthLoginDoc,
  AdminAuthProfileDoc,
  AdminAuthRefreshDoc,
  AdminAuthUpdateProfileDoc,
} from '../docs/admin.auth.doc';
import { AdminChangePasswordDto } from '../dtos/admin.change-password.dto';
import { AdminLoginDto } from '../dtos/admin.login.dto';
import { AdminUpdateNameDto } from '../dtos/admin.update-name.dto';
import { ForgetPasswordDto } from '../dtos/forget-password ';
import { OTPResetPasswordDto } from '../dtos/otp-reset-password';
import { IAdminDoc } from '../interfaces/admin.interface';
import { AdminDoc, AdminEntity } from '../repository/entities/admin.entity';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin Auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthController {
  constructor(
    @DatabaseConnection() private readonly databaseConnection: Connection,
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @AdminAuthLoginDoc()
  @ResponseSingle('admin.login')
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() { email, password }: AdminLoginDto): Promise<IResponse> {
    const admin: AdminDoc = await this.adminService.findOneByEmail(email);
    if (!admin) {
      throw new NotFoundException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_NOT_FOUND_ERROR,
        message: 'admin.error.notFound',
      });
    }

    const passwordAttempt: boolean =
      await this.authService.getPasswordAttempt();
    const maxPasswordAttempt: number =
      await this.authService.getMaxPasswordAttempt();
    if (passwordAttempt && admin.passwordAttempt >= maxPasswordAttempt) {
      throw new ForbiddenException({
        statusCode:
          ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_PASSWORD_ATTEMPT_MAX_ERROR,
        message: 'admin.error.passwordAttemptMax',
      });
    }

    const validate: boolean = await this.authService.validateUser(
      password,
      admin.password,
    );
    if (!validate) {
      await this.adminService.increasePasswordAttempt(admin);

      throw new BadRequestException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_PASSWORD_NOT_MATCH_ERROR,
        message: 'admin.error.passwordNotMatch',
      });
    } else if (!admin.isActive) {
      throw new ForbiddenException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_INACTIVE_ERROR,
        message: 'admin.error.inactive',
      });
    }

    await this.adminService.resetPasswordAttempt(admin);

    const payload: AdminEntity =
      await this.adminService.payloadSerialization(admin);
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const loginDate: Date = await this.authService.getLoginDate();
    const payloadAccessToken: AuthAccessPayloadSerialization =
      await this.authService.createPayloadAccessToken(payload, {
        loginWith: ENUM_AUTH_LOGIN_WITH.EMAIL,
        loginFrom: ENUM_AUTH_LOGIN_FROM.PASSWORD,
        loginDate,
        kind: ACCOUNT_KIND.SUPERADMIN,
      });
    const payloadRefreshToken: AuthRefreshPayloadSerialization =
      await this.authService.createPayloadRefreshToken(
        payload._id?.toString(),
        payloadAccessToken,
      );

    const payloadEncryption = await this.authService.getPayloadEncryption();
    let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
      payloadAccessToken;
    let payloadHashedRefreshToken: AuthRefreshPayloadSerialization | string =
      payloadRefreshToken;

    if (payloadEncryption) {
      payloadHashedAccessToken =
        await this.authService.encryptAccessToken(payloadAccessToken);
      payloadHashedRefreshToken =
        await this.authService.encryptRefreshToken(payloadRefreshToken);
    }

    const accessToken: string = await this.authService.createAccessToken(
      payloadHashedAccessToken,
    );
    const refreshToken: string = await this.authService.createRefreshToken(
      payloadHashedRefreshToken,
    );

    const checkPasswordExpired: boolean =
      await this.authService.checkPasswordExpired(admin.passwordExpired);

    if (checkPasswordExpired) {
      throw new ForbiddenException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_PASSWORD_EXPIRED_ERROR,
        message: 'admin.error.passwordExpired',
      });
    }

    return {
      data: {
        tokenType,
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }

  @AdminAuthRefreshDoc()
  @ResponseSingle('admin.refresh')
  @AdminAuthProtected()
  @AdminProtected()
  @AuthJwtRefreshProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @AuthJwtToken() refreshToken: string,
    @AuthJwtPayload<AuthRefreshPayloadSerialization>()
    refreshPayload: AuthRefreshPayloadSerialization,
    @GetAdmin() admin: AdminDoc,
  ): Promise<IResponse> {
    const adminDoc: IAdminDoc = await this.adminService.findOneById(
      admin?._id?.toString(),
    );

    const checkPasswordExpired: boolean =
      await this.authService.checkPasswordExpired(admin.passwordExpired);

    if (checkPasswordExpired) {
      throw new ForbiddenException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_PASSWORD_EXPIRED_ERROR,
        message: 'admin.error.passwordExpired',
      });
    }

    const payload: AdminEntity =
      await this.adminService.payloadSerialization(adminDoc);
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const payloadAccessToken: AuthAccessPayloadSerialization =
      await this.authService.createPayloadAccessToken(payload, {
        loginDate: refreshPayload.loginDate,
        loginFrom: refreshPayload.loginFrom,
        loginWith: refreshPayload.loginWith,
        kind: ACCOUNT_KIND.SUPERADMIN,
      });

    const payloadEncryption = await this.authService.getPayloadEncryption();
    let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
      payloadAccessToken;

    if (payloadEncryption) {
      payloadHashedAccessToken =
        await this.authService.encryptAccessToken(payloadAccessToken);
    }

    const accessToken: string = await this.authService.createAccessToken(
      payloadHashedAccessToken,
    );

    return {
      data: {
        tokenType,
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }

  @AdminAuthChangePasswordDoc()
  @ResponseSingle('admin.changePassword')
  @AdminProtected()
  @AuthJwtAccessProtected()
  @Patch('/change-password')
  async changePassword(
    @Body() body: AdminChangePasswordDto,
    @GetAdmin() admin: AdminDoc,
  ): Promise<void> {
    const passwordAttempt: boolean =
      await this.authService.getPasswordAttempt();
    const maxPasswordAttempt: number =
      await this.authService.getMaxPasswordAttempt();
    if (passwordAttempt && admin.passwordAttempt >= maxPasswordAttempt) {
      throw new ForbiddenException({
        statusCode:
          ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_PASSWORD_ATTEMPT_MAX_ERROR,
        message: 'admin.error.passwordAttemptMax',
      });
    }

    const matchPassword: boolean = await this.authService.validateUser(
      body.oldPassword,
      admin.password,
    );
    if (!matchPassword) {
      await this.adminService.increasePasswordAttempt(admin);

      throw new BadRequestException({
        statusCode: ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_PASSWORD_NOT_MATCH_ERROR,
        message: 'admin.error.passwordNotMatch',
      });
    }

    const newMatchPassword: boolean = await this.authService.validateUser(
      body.newPassword,
      admin.password,
    );
    if (newMatchPassword) {
      throw new BadRequestException({
        statusCode:
          ENUM_ADMIN_STATUS_CODE_ERROR.ADMIN_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
        message: 'admin.error.newPasswordMustDifference',
      });
    }

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();

    try {
      await this.adminService.resetPasswordAttempt(admin, { session });

      const password: IAuthPassword = await this.authService.createPassword(
        body.newPassword,
      );

      await this.adminService.updatePassword(admin, password, { session });

      await session.commitTransaction();
      await session.endSession();
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();

      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      });
    }
  }

  @AdminAuthProfileDoc()
  @ResponseSingle('admin.profile')
  @AdminProtected()
  @AuthJwtAccessProtected()
  @Get('/profile')
  async profile(@GetAdmin() admin: AdminDoc): Promise<IResponse> {
    const adminDoc: IAdminDoc = await this.adminService.findOneById(
      admin?._id?.toString(),
    );
    return { data: adminDoc };
  }

  @AdminAuthUpdateProfileDoc()
  @ResponseSingle('admin.updateProfile')
  @AdminProtected()
  @AuthJwtAccessProtected()
  @Patch('/profile/update')
  async updateProfile(
    @GetAdmin() admin: AdminDoc,
    @Body() body: AdminUpdateNameDto,
  ): Promise<IResponse> {
    const authDoc = await this.adminService.update(admin, body);

    return { data: authDoc?._id };
  }

  @ResponseSingle('admin.passwordForgot')
  @Post('/forgot-password')
  async forgotPassword(@Body() payload: ForgetPasswordDto) {
    try {
      return this.adminService.resetPassword(payload?.email);
    } catch (error) {
      throw error;
    }
  }

  @Post('/reset-password/')
  @ResponseSingle('admin.passwordReset')
  async resetPasswordWithOTP(@Body() payload: OTPResetPasswordDto) {
    try {
      await this.adminService.verifyPasswordResetToken(
        payload?.otp,
        payload?.mobileNumber,
        payload?.email,
      );
      if (payload?.email) {
        return this.adminService.handlePasswordReset(
          payload?.otp,
          payload?.password,
          payload?.email,
        );
      }
      return this.adminService.handlePasswordResetByMobileNumber(
        payload?.otp,
        payload?.password,
        payload?.mobileNumber,
      );
    } catch (error) {
      throw error;
    }
  }
}
