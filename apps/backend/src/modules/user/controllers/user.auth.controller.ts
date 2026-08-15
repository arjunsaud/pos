import {
  BadRequestException,
  Body,
  ConflictException,
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
import {
  GetUser,
  UserAuthProtected,
  UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import {
  UserAuthChangePasswordDoc,
  UserAuthLoginDoc,
  UserAuthProfileDoc,
  UserAuthRefreshDoc,
  UserAuthUpdateProfileDoc,
} from 'src/modules/user/docs/user.auth.doc';
import { UserChangePasswordDto } from 'src/modules/user/dtos/user.change-password.dto';
import { UserLoginDto } from 'src/modules/user/dtos/user.login.dto';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
import { IUserDoc } from 'src/modules/user/interfaces/user.interface';
import {
  UserDoc,
  UserEntity,
} from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { TenantService } from 'src/modules/tenant/services/tenant.service';
import { ForgetPasswordDto } from '../dtos/forget-password ';
import { OTPResetPasswordDto } from '../dtos/otp-reset-password';
import { UserCreateDto } from '../dtos/user.create.dto';

@ApiTags('Auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class UserAuthController {
  constructor(
    @DatabaseConnection() private readonly databaseConnection: Connection,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly tenantService: TenantService,
  ) {}

  @ResponseSingle('user.create')
  @Post('/register')
  async create(
    @Body()
    { email, mobileNumber, ...body }: UserCreateDto,
  ): Promise<IResponse> {
    const promises: Promise<any>[] = [this.userService.existByEmail(email)];

    if (mobileNumber) {
      promises.push(this.userService.existByMobileNumber(mobileNumber));
    }

    const [emailExist, mobileNumberExist] = await Promise.all(promises);

    if (emailExist) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'user.error.emailExist',
      });
    } else if (mobileNumberExist) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: 'user.error.mobileNumberExist',
      });
    }

    const password: IAuthPassword = await this.authService.createPassword(
      body.password,
    );

    const storeName = body.tenantName || body.fullName;
    const slug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24) || 'store';
    const tenant = await this.tenantService.create({
      name: storeName,
      email,
      phone: mobileNumber || '9800000000',
      plan: 'Basic',
      status: 'active',
      domain: `${slug}.posnepal.com`,
      ownerName: body.fullName,
    });

    const created: UserDoc = await this.userService.create(
      {
        email,
        mobileNumber,
        ...body,
        tenantId: String(tenant._id),
        tenantName: tenant.name,
      },
      password,
    );

    return {
      data: { _id: created._id },
    };
  }

  @UserAuthLoginDoc()
  @ResponseSingle('user.login')
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() { email, password }: UserLoginDto): Promise<IResponse> {
    const user: UserDoc = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const passwordAttempt: boolean =
      await this.authService.getPasswordAttempt();
    const maxPasswordAttempt: number =
      await this.authService.getMaxPasswordAttempt();
    if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
      throw new ForbiddenException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'user.error.passwordAttemptMax',
      });
    }

    const validate: boolean = await this.authService.validateUser(
      password,
      user.password,
    );
    if (!validate) {
      await this.userService.increasePasswordAttempt(user);

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.passwordNotMatch',
      });
    } else if (!user.isActive) {
      throw new ForbiddenException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.inactive',
      });
    } else if (!user.tenantId) {
      throw new ForbiddenException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.tenantRequired',
      });
    }

    await this.userService.resetPasswordAttempt(user);

    const payload: UserDoc = await this.userService.payloadSerializationId({
      _id: user?._id,
    });
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const loginDate: Date = await this.authService.getLoginDate();
    const payloadAccessToken: AuthAccessPayloadSerialization =
      await this.authService.createPayloadAccessToken(payload, {
        loginWith: ENUM_AUTH_LOGIN_WITH.EMAIL,
        loginFrom: ENUM_AUTH_LOGIN_FROM.PASSWORD,
        loginDate,
        kind: ACCOUNT_KIND.TENANT,
        tenantId: user.tenantId ? String(user.tenantId) : undefined,
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

    return {
      data: {
        tokenType,
        expiresIn,
        accessToken,
        refreshToken,
      },
    };
  }

  @UserAuthRefreshDoc()
  @ResponseSingle('user.refresh')
  @UserAuthProtected()
  @UserProtected()
  @AuthJwtRefreshProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @AuthJwtToken() refreshToken: string,
    @AuthJwtPayload<AuthRefreshPayloadSerialization>()
    refreshPayload: AuthRefreshPayloadSerialization,
    @GetUser() user: UserDoc,
  ): Promise<IResponse> {
    const userDoc: IUserDoc = await this.userService.findOneById(
      user?._id?.toString(),
    );

    // const checkPasswordExpired: boolean =
    //   await this.authService.checkPasswordExpired(user.passwordExpired);

    // if (checkPasswordExpired) {
    //   throw new ForbiddenException({
    //     statusCode: HttpStatus.UNAUTHORIZED,
    //     message: 'user.error.passwordExpired',
    //   });
    // }

    const payload: UserEntity =
      await this.userService.payloadSerialization(userDoc);
    const tokenType: string = await this.authService.getTokenType();
    const expiresIn: number =
      await this.authService.getAccessTokenExpirationTime();
    const payloadAccessToken: AuthAccessPayloadSerialization =
      await this.authService.createPayloadAccessToken(payload, {
        loginDate: refreshPayload.loginDate,
        loginFrom: refreshPayload.loginFrom,
        loginWith: refreshPayload.loginWith,
        kind: ACCOUNT_KIND.TENANT,
        tenantId: userDoc.tenantId ? String(userDoc.tenantId) : undefined,
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

  @UserAuthChangePasswordDoc()
  @ResponseSingle('user.changePassword')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/change-password')
  async changePassword(
    @Body() body: UserChangePasswordDto,
    @GetUser() user: UserDoc,
  ): Promise<void> {
    const passwordAttempt: boolean =
      await this.authService.getPasswordAttempt();
    const maxPasswordAttempt: number =
      await this.authService.getMaxPasswordAttempt();
    if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
      throw new ForbiddenException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'user.error.passwordAttemptMax',
      });
    }

    const matchPassword: boolean = await this.authService.validateUser(
      body.oldPassword,
      user.password,
    );
    if (!matchPassword) {
      await this.userService.increasePasswordAttempt(user);

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.passwordNotMatch',
      });
    }

    const newMatchPassword: boolean = await this.authService.validateUser(
      body.newPassword,
      user.password,
    );
    if (newMatchPassword) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.newPasswordMustDifference',
      });
    }

    const session: ClientSession = await this.databaseConnection.startSession();
    session.startTransaction();

    try {
      await this.userService.resetPasswordAttempt(user, { session });

      const password: IAuthPassword = await this.authService.createPassword(
        body.newPassword,
      );

      await this.userService.updatePassword(user, password, { session });

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

    return;
  }

  @UserAuthProfileDoc()
  @ResponseSingle('user.profile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/profile')
  async profile(@GetUser() user: UserDoc): Promise<IResponse> {
    const userDoc: IUserDoc = await this.userService.findOneById(
      user?._id?.toString(),
    );
    return { data: userDoc };
  }

  @UserAuthUpdateProfileDoc()
  @ResponseSingle('user.updateProfile')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/profile/update')
  async updateProfile(
    @GetUser() user: UserDoc,
    @Body() body: UserUpdateNameDto,
  ): Promise<void> {
    await this.userService.updateName(user, body);

    return;
  }

  @ResponseSingle('user.passwordForgot')
  @Post('/forgot-password')
  async forgotPassword(@Body() payload: ForgetPasswordDto) {
    try {
      return this.userService.resetPassword(payload?.email);
    } catch (error) {
      throw error;
    }
  }

  @Post('/reset-password/')
  @ResponseSingle('user.passwordReset')
  async resetPasswordWithOTP(@Body() payload: OTPResetPasswordDto) {
    try {
      await this.userService.verifyPasswordResetToken(
        payload?.otp,
        payload?.mobileNumber,
        payload?.email,
      );
      if (payload?.email) {
        return this.userService.handlePasswordReset(
          payload?.otp,
          payload?.password,
          payload?.email,
        );
      }
      return this.userService.handlePasswordResetByMobileNumber(
        payload?.otp,
        payload?.password,
        payload?.mobileNumber,
      );
    } catch (error) {
      throw error;
    }
  }
}
