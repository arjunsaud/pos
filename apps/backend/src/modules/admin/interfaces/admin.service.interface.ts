import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
} from 'src/common/database/interfaces/database.interface';
import { AdminCreateDto } from 'src/modules/admin/dtos/admin.create.dto';
import { AdminUpdateNameDto } from 'src/modules/admin/dtos/admin.update-name.dto';
import { AdminUpdatePasswordAttemptDto } from 'src/modules/admin/dtos/admin.update-password-attempt.dto';
import {
  IAdminDoc,
  IAdminEntity,
} from 'src/modules/admin/interfaces/admin.interface';
import {
  AdminDoc,
  AdminEntity,
} from 'src/modules/admin/repository/entities/admin.entity';

export interface IAdminService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IAdminEntity[]>;
  findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  findOne<T>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  findOneByEmail<T>(
    email: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  findOneByMobileNumber<T>(
    mobileNumber: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;
  create(
    { fullName, email, mobileNumber }: AdminCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseCreateOptions,
  ): Promise<AdminDoc>;
  existByEmail(
    email: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;
  existByMobileNumber(
    mobileNumber: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;

  delete(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  update(
    repository: AdminDoc,
    data: AdminUpdateNameDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  updatePassword(
    repository: AdminDoc,
    { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  active(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminEntity>;
  inactive(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  inactivePermanent(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  updatePasswordAttempt(
    repository: AdminDoc,
    { passwordAttempt }: AdminUpdatePasswordAttemptDto,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  increasePasswordAttempt(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  resetPasswordAttempt(
    repository: AdminDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  updatePasswordExpired(
    repository: AdminDoc,
    passwordExpired: Date,
    options?: IDatabaseSaveOptions,
  ): Promise<AdminDoc>;
  createPhotoFilename(): Promise<Record<string, any>>;
  payloadSerialization(data: IAdminDoc): Promise<any>;
  deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean>;
}
