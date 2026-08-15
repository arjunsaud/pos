import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
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
import { AdminCreateDto } from 'src/modules/admin/dtos/admin.create.dto';
import { AdminUpdateNameDto } from 'src/modules/admin/dtos/admin.update-name.dto';
import { AdminUpdatePasswordAttemptDto } from 'src/modules/admin/dtos/admin.update-password-attempt.dto';
import {
  IAdminDoc,
  IAdminEntity,
} from 'src/modules/admin/interfaces/admin.interface';

import { IAdminService } from 'src/modules/admin/interfaces/admin.service.interface';
import {
  AdminDoc,
  AdminEntity,
} from 'src/modules/admin/repository/entities/admin.entity';
import { AdminRepository } from 'src/modules/admin/repository/repositories/admin.repository';
import { MailQueueService } from 'src/common/mail-queue/mail.queue.service';

@Injectable()
export class AdminService implements IAdminService {
  private readonly uploadPath: string;

  private readonly mobileNumberCountryCodeAllowed: string[];

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly helperStringService: HelperStringService,
    protected readonly authService: AuthService,
    private readonly configService: ConfigService,
    protected readonly helperService: HelperNumberService,
    protected readonly mailerQueueService: MailQueueService,
  ) {
    this.uploadPath = this.configService.get<string>('admin.uploadPath', '');

    this.mobileNumberCountryCodeAllowed = this.configService.get<string[]>(
      'admin.mobileNumberCountryCodeAllowed',
      [],
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IAdminEntity[]> {
    return this.adminRepository.findAll<IAdminEntity>(find, {
      ...options,
    });
  }

  async findOneById<T>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.adminRepository.findOneById<T>(_id, options);
  }

  async findOne<T>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.adminRepository.findOne<T>(find, options);
  }

  async findOneByAdminname<T>(
    adminname: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.adminRepository.findOne<T>({ adminname }, options);
  }

  async findOneByEmail<T>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.adminRepository.findOne<T>({ email }, options);
  }

  async findOneByMobileNumber<T>(
    mobileNumber: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    return this.adminRepository.findOne<T>({ mobileNumber }, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.adminRepository.getTotal(find, { ...options, join: true });
  }

  async seedAdmin(
    { fullName, email, mobileNumber, role }: AdminCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseCreateOptions,
  ): Promise<AdminDoc> {
    const create: AdminEntity = new AdminEntity();
    create.fullName = fullName;
    create.email = email;
    create.password = passwordHash;
    create.role = role;
    create.isActive = true;

    create.salt = salt;
    create.passwordExpired = passwordExpired;
    create.passwordCreated = passwordCreated;
    create.passwordAttempt = 0;
    create.mobileNumber = mobileNumber ?? undefined;

    return this.adminRepository.create<AdminEntity>(create, options);
  }

  async create(
    { fullName, email, mobileNumber }: AdminCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseCreateOptions,
  ): Promise<AdminDoc> {
    const create: AdminEntity = new AdminEntity();
    create.fullName = fullName;
    create.email = email;
    create.password = passwordHash;
    create.role = USER_STATUS.STAFF;
    create.isActive = true;

    create.salt = salt;
    create.passwordExpired = passwordExpired;
    create.passwordCreated = passwordCreated;
    create.passwordAttempt = 0;
    create.mobileNumber = mobileNumber ?? undefined;

    return this.adminRepository.create<AdminEntity>(create, options);
  }

  async existByEmail(
    email: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.adminRepository.exists(
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
    return this.adminRepository.exists(
      {
        mobileNumber,
      },
      { ...options, withDeleted: true },
    );
  }

  async existByAdminname(
    adminname: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    return this.adminRepository.exists(
      { adminname },
      { ...options, withDeleted: true },
    );
  }

  async delete(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    return this.adminRepository.softDelete(repository, options);
  }

  async update(
    repository: AdminDoc,
    data: AdminUpdateNameDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    if (data.photo) {
      repository.photo = data.photo;
    }
    if (data.fullName) {
      repository.fullName = data.fullName;
    }
    if (data.dob) {
      repository.dob = data.dob;
    }
    if (data.gender) {
      repository.gender = data.gender;
    }

    return this.adminRepository.save(repository, options);
  }

  async updatePassword(
    repository: AdminDoc,
    { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    repository.password = passwordHash;
    repository.passwordExpired = passwordExpired;
    repository.passwordCreated = passwordCreated;
    repository.salt = salt;

    return this.adminRepository.save(repository, options);
  }

  async active(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminEntity> {
    repository.isActive = true;
    return this.adminRepository.save(repository, options);
  }

  async inactive(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    repository.isActive = false;
    return this.adminRepository.save(repository, options);
  }

  async inactivePermanent(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    repository.isActive = false;

    return this.adminRepository.save(repository, options);
  }

  async updatePasswordAttempt(
    repository: AdminDoc,
    { passwordAttempt }: AdminUpdatePasswordAttemptDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    repository.passwordAttempt = passwordAttempt;

    return this.adminRepository.save(repository, options);
  }

  async increasePasswordAttempt(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    repository.passwordAttempt = ++repository.passwordAttempt;

    return this.adminRepository.save(repository, options);
  }

  async resetPasswordAttempt(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    repository.passwordAttempt = 0;

    return this.adminRepository.save(repository, options);
  }

  async updatePasswordExpired(
    repository: AdminDoc,
    passwordExpired: Date,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc> {
    repository.passwordExpired = passwordExpired;

    return this.adminRepository.save(repository, options);
  }

  async createPhotoFilename(): Promise<Record<string, any>> {
    const filename: string = this.helperStringService.random(20);

    return {
      path: this.uploadPath,
      filename: filename,
    };
  }

  async payloadSerialization(data: IAdminDoc): Promise<AdminEntity> {
    const obj = data.toObject();
    delete obj.password;
    delete obj.salt;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    return plainToInstance(AdminEntity, obj);
  }

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {
    return this.adminRepository.deleteMany(find, options);
  }

  async getMobileNumberCountryCodeAllowed(): Promise<string[]> {
    return this.mobileNumberCountryCodeAllowed;
  }

  async resetPassword(email: string) {
    const code: string = this.helperService.random(6).toString();

    const admin: AdminDoc = await this.findOne({ email });

    if (!admin) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'admin.error.notFound',
      });
    }

    admin.passwordResetToken = await bcrypt.hash(code, 10);

    admin.passwordResetExpires = new Date(Date.now() + 300000);

    await this.adminRepository.save(admin);

    this.mailerQueueService.addJobForgetPassword({
      to: email,
      subject: 'Password Reset',
      code: code,
    });

    return { data: 'Code sent to email successfully' };
  }

  async verifyPasswordResetToken(
    otp: string,
    mobileNumber: string,
    email: string,
  ): Promise<any> {
    let admin: AdminDoc;

    if (email) {
      admin = await this.findOne({
        email: email,
      });
    } else if (mobileNumber) {
      admin = await this.findOne({
        mobileNumber: mobileNumber,
      });
    } else {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'admin.error.notFound',
      });
    }

    if (!admin) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'admin.error.notFound',
      });
    }

    if (!admin?.passwordResetToken) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'admin.error.invalidOtp',
      });
    }

    const verified = await bcrypt.compare(otp, admin?.passwordResetToken);

    if (!verified) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'admin.error.invalidOtp',
      });
    } else {
      // admin.passwordResetToken = '';
      // admin.passwordResetExpires = new Date(Date.now() - 300000);
      // admin.passwordAttempt = 0;
      // await this.repository.save(admin);
      return { data: 'Token verified successfully' };
    }
  }

  async handlePasswordReset(
    otp: string,
    newPassword: string,
    email: string,
  ): Promise<any> {
    // const hashedToken = await bcrypt.hash(token, 10);
    // const admin: BaseAdminDocument = await this.findOne({
    //   passwordResetToken: hashedToken,
    //   passwordResetExpires: { $gt: new Date() },
    // });
    const admin: AdminDoc = await this.findOne({ email });
    if (!admin) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'admin.error.notFound',
      });
    }

    if (!admin?.passwordResetToken) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'admin.error.invalidOtp',
      });
    }
    const verified = await bcrypt.compare(otp, admin?.passwordResetToken);

    if (verified) {
      const password = await this.authService.createPassword(newPassword);

      admin.passwordResetToken = '';
      admin.passwordResetExpires = new Date(Date.now() - 300000);
      admin.password = password.passwordHash;
      admin.passwordExpired = password.passwordExpired;
      admin.passwordCreated = password.passwordCreated;
      admin.salt = password.salt;
      admin.passwordAttempt = 0;
      return await this.adminRepository.save(admin);
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
    const admin: AdminDoc = await this.findOne({
      mobileNumber: mobileNumber,
    });

    if (!admin) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'admin.error.notFound',
      });
    }

    if (!admin?.passwordResetToken) {
      throw new BadRequestException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'admin.error.invalidOtp',
      });
    }
    const verified = await bcrypt.compare(otp, admin.passwordResetToken);

    if (verified) {
      const password = await this.authService.createPassword(newPassword);

      admin.passwordResetToken = '';
      admin.passwordResetExpires = new Date(Date.now() - 300000);
      admin.password = password.passwordHash;
      admin.passwordExpired = password.passwordExpired;
      admin.passwordCreated = password.passwordCreated;
      admin.passwordAttempt = 0;

      admin.salt = password.salt;
      return await this.adminRepository.save(admin);
    }
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Password reset token is invalid or has expired.',
    });
  }
}
