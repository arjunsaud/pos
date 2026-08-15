import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { USER_STATUS } from 'src/common/enum/user.status.enum';
import { HelperNumberService } from 'src/common/helper/services/helper.number.service';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { MailQueueService } from 'src/common/mail-queue/mail.queue.service';
import { OtpType } from '@posnepal/shared';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { VerificationService } from 'src/modules/verification/verification.service';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
import { UserUpdatePasswordAttemptDto } from 'src/modules/user/dtos/user.update-password-attempt.dto';
import { UserUpdateUsernameDto } from 'src/modules/user/dtos/user.update-username.dto';
import {
  IUserDoc,
  IUserEntity,
} from 'src/modules/user/interfaces/user.interface';

import { IUserService } from 'src/modules/user/interfaces/user.service.interface';
import {
  UserDoc,
  UserEntity,
} from 'src/modules/user/repository/entities/user.entity';
import { UserRepository } from 'src/modules/user/repository/repositories/user.repository';

@Injectable()
export class UserService implements IUserService {
  private readonly uploadPath: string;

  private readonly mobileNumberCountryCodeAllowed: string[];

  constructor(
    private readonly userRepository: UserRepository,
    private readonly helperStringService: HelperStringService,
    protected readonly authService: AuthService,
    private readonly configService: ConfigService,
    protected readonly helperService: HelperNumberService,
    protected readonly mailerQueueService: MailQueueService,
    protected readonly verificationService: VerificationService,
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath', '');

    this.mobileNumberCountryCodeAllowed = this.configService.get<string[]>(
      'user.mobileNumberCountryCodeAllowed',
      [],
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserEntity[]> {
    return this.userRepository.findAll<IUserEntity>(find, {
      ...options,
    });
  }

  async findOneById<T>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOneById<T>(_id, options);
  }

  async findOne<T>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>(find, options);
  }

  async findOneByUsername<T>(
    username: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>({ username }, options);
  }

  async findOneByEmail<T>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>({ email }, options);
  }

  async findOneByMobileNumber<T>(
    mobileNumber: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.userRepository.findOne<T>({ mobileNumber }, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.userRepository.getTotal(find, { ...options });
  }

  async create(
    {
      fullName,
      email,
      mobileNumber,
      tenantId,
      tenantName,
      tenantStaffRole,
      permissions,
    }: UserCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc> {
    const create: UserEntity = new UserEntity();
    create.fullName = fullName;
    create.email = email;
    create.password = passwordHash;
    create.role = tenantStaffRole ? USER_STATUS.STAFF : USER_STATUS.TENANT;
    create.isActive = true;
    create.salt = salt;
    create.passwordExpired = passwordExpired;
    create.passwordCreated = passwordCreated;
    create.passwordAttempt = 0;
    create.mobileNumber = mobileNumber ?? undefined;
    if (!tenantId) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.tenantRequired',
      });
    }
    create.tenantId = new Types.ObjectId(tenantId);
    create.tenantName = tenantName;
    create.tenantStaffRole = tenantStaffRole;
    create.permissions = permissions ?? [];

    return this.userRepository.create<UserEntity>(create, options);
  }

  async existByEmail(
    email: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      {
        email: {
          $regex: new RegExp(`\\b${email}\\b`),
          $options: 'i',
        },
      },
      { ...options, withDeleted: true },
    );
  }

  async existByMobileNumber(
    mobileNumber: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      {
        mobileNumber,
      },
      { ...options, withDeleted: true },
    );
  }

  async existByUsername(
    username: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.userRepository.exists(
      { username },
      { ...options, withDeleted: true },
    );
  }

  async delete(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    return this.userRepository.softDelete(repository, options);
  }

  async updateStaff(
    repository: UserDoc,
    data: {
      fullName?: string;
      mobileNumber?: string;
      tenantStaffRole?: string;
      permissions?: string[];
    },
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    if (data.fullName !== undefined) {
      repository.fullName = data.fullName;
    }
    if (data.mobileNumber !== undefined) {
      repository.mobileNumber = data.mobileNumber;
    }
    if (data.tenantStaffRole !== undefined) {
      repository.tenantStaffRole = data.tenantStaffRole;
    }
    if (data.permissions !== undefined) {
      repository.permissions = data.permissions;
    }
    return this.userRepository.save(repository, options);
  }

  async updateName(
    repository: UserDoc,
    { fullName }: UserUpdateNameDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.fullName = fullName;

    return this.userRepository.save(repository, options);
  }

  async updateUsername(
    repository: UserDoc,
    { username }: UserUpdateUsernameDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.username = username;

    return this.userRepository.save(repository, options);
  }

  async updatePhoto(
    repository: UserDoc,
    photo: AwsS3Serialization,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.photo = photo;

    return this.userRepository.save(repository, options);
  }

  async updatePassword(
    repository: UserDoc,
    { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.password = passwordHash;
    repository.passwordExpired = passwordExpired;
    repository.passwordCreated = passwordCreated;
    repository.salt = salt;

    return this.userRepository.save(repository, options);
  }

  async active(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserEntity> {
    repository.isActive = true;
    return this.userRepository.save(repository, options);
  }

  async inactive(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.isActive = false;
    return this.userRepository.save(repository, options);
  }

  async inactivePermanent(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.isActive = false;

    return this.userRepository.save(repository, options);
  }

  async updatePasswordAttempt(
    repository: UserDoc,
    { passwordAttempt }: UserUpdatePasswordAttemptDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.passwordAttempt = passwordAttempt;

    return this.userRepository.save(repository, options);
  }

  async increasePasswordAttempt(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.passwordAttempt = ++repository.passwordAttempt;

    return this.userRepository.save(repository, options);
  }

  async resetPasswordAttempt(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.passwordAttempt = 0;

    return this.userRepository.save(repository, options);
  }

  async updatePasswordExpired(
    repository: UserDoc,
    passwordExpired: Date,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.passwordExpired = passwordExpired;

    return this.userRepository.save(repository, options);
  }

  async createPhotoFilename(): Promise<Record<string, any>> {
    const filename: string = this.helperStringService.random(20);

    return {
      path: this.uploadPath,
      filename: filename,
    };
  }

  async payloadSerialization(data: IUserDoc): Promise<UserEntity> {
    const obj = data.toObject();
    delete obj.password;
    delete obj.salt;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    return plainToInstance(UserEntity, obj);
  }

  async payloadSerializationId(data: Record<string, any>): Promise<any> {
    return data;
  }
  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.userRepository.deleteMany(find, options);
  }

  async getMobileNumberCountryCodeAllowed(): Promise<string[]> {
    return this.mobileNumberCountryCodeAllowed;
  }

  async resetPassword(email: string) {
    const code: string = this.helperService.random(6).toString();

    const user: UserDoc = await this.findOne({ email });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    user.passwordResetToken = await bcrypt.hash(code, 10);

    user.passwordResetExpires = new Date(Date.now() + 300000);

    await this.userRepository.save(user);

    this.mailerQueueService.addJobForgetPassword({
      to: email,
      subject: 'Password Reset',
      code: code,
    });

    return { data: 'Code sent to email successfully' };
  }

  async sendTwoFactorOtp(email: string) {
    const created = await this.verificationService.createOTP({
      type: OtpType.TWOFA,
      email,
    });
    this.mailerQueueService.addJobForgetPassword({
      to: email,
      subject: 'Your POS Nepal 2FA code',
      code: created.otp,
    });
    return { data: 'Code sent to email successfully' };
  }

  async verifyTwoFactorOtp(email: string, otp: string) {
    return this.verificationService.verifyEmailOTP({
      type: OtpType.TWOFA,
      email,
      otp,
    });
  }

  async setTwoFactorEnabled(
    repository: UserDoc,
    enabled: boolean,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc> {
    repository.twoFactorEnabled = enabled;
    return this.userRepository.save(repository, options);
  }

  async verifyPasswordResetToken(
    otp: string,
    mobileNumber: string,
    email: string,
  ): Promise<any> {
    let user: UserDoc;

    if (email) {
      user = await this.findOne({
        email: email,
      });
    } else if (mobileNumber) {
      user = await this.findOne({
        mobileNumber: mobileNumber,
      });
    } else {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (!user?.passwordResetToken) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.invalidOtp',
      });
    }

    const verified = await bcrypt.compare(otp, user?.passwordResetToken);

    if (!verified) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.invalidOtp',
      });
    } else {
      // user.passwordResetToken = '';
      // user.passwordResetExpires = new Date(Date.now() - 300000);
      // user.passwordAttempt = 0;
      // await this.repository.save(user);
      return { data: 'Token verified successfully' };
    }
  }

  async handlePasswordReset(
    otp: string,
    newPassword: string,
    email: string,
  ): Promise<any> {
    // const hashedToken = await bcrypt.hash(token, 10);
    // const user: BaseUserDocument = await this.findOne({
    //   passwordResetToken: hashedToken,
    //   passwordResetExpires: { $gt: new Date() },
    // });
    const user: UserDoc = await this.findOne({ email });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (!user?.passwordResetToken) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'user.error.invalidOtp',
      });
    }
    const verified = await bcrypt.compare(otp, user?.passwordResetToken);

    if (verified) {
      const password = await this.authService.createPassword(newPassword);

      user.passwordResetToken = '';
      user.passwordResetExpires = new Date(Date.now() - 300000);
      user.password = password.passwordHash;
      user.passwordExpired = password.passwordExpired;
      user.passwordCreated = password.passwordCreated;
      user.salt = password.salt;
      user.passwordAttempt = 0;
      return await this.userRepository.save(user);
    }
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Password reset token is invalid or has expired.',
    });
  }

  async handlePasswordResetByMobileNumber(
    mobileNumber: string,
    otp: string,
    newPassword: string,
  ): Promise<any> {
    const user: UserDoc = await this.findOne({
      mobileNumber: mobileNumber,
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (!user?.passwordResetToken) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'user.error.invalidOtp',
      });
    }
    const verified = await bcrypt.compare(otp, user.passwordResetToken);

    if (verified) {
      const password = await this.authService.createPassword(newPassword);

      user.passwordResetToken = '';
      user.passwordResetExpires = new Date(Date.now() - 300000);
      user.password = password.passwordHash;
      user.passwordExpired = password.passwordExpired;
      user.passwordCreated = password.passwordCreated;
      user.passwordAttempt = 0;

      user.salt = password.salt;
      return await this.userRepository.save(user);
    }
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Password reset token is invalid or has expired.',
    });
  }
}
