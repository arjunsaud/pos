import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
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
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserUpdateNameDto } from 'src/modules/user/dtos/user.update-name.dto';
import { UserUpdatePasswordAttemptDto } from 'src/modules/user/dtos/user.update-password-attempt.dto';
import { UserUpdateUsernameDto } from 'src/modules/user/dtos/user.update-username.dto';
import {
  IUserDoc,
  IUserEntity,
} from 'src/modules/user/interfaces/user.interface';
import {
  UserDoc,
  UserEntity,
} from 'src/modules/user/repository/entities/user.entity';

export interface IUserService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserEntity[]>;
  findOneById<T>(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;
  findOne<T>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;
  findOneByUsername<T>(
    username: string,
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
    { fullName, email, mobileNumber }: UserCreateDto,
    { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseCreateOptions,
  ): Promise<UserDoc>;
  existByEmail(
    email: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;
  existByMobileNumber(
    mobileNumber: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;
  existByUsername(
    username: string,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;
  delete(repository: UserDoc, options?: IDatabaseSaveOptions): Promise<UserDoc>;
  updateName(
    repository: UserDoc,
    { fullName }: UserUpdateNameDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  updateUsername(
    repository: UserDoc,
    { username }: UserUpdateUsernameDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  updatePhoto(
    repository: UserDoc,
    photo: AwsS3Serialization,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  updatePassword(
    repository: UserDoc,
    { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  active(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserEntity>;
  inactive(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  inactivePermanent(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  updatePasswordAttempt(
    repository: UserDoc,
    { passwordAttempt }: UserUpdatePasswordAttemptDto,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  increasePasswordAttempt(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  resetPasswordAttempt(
    repository: UserDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  updatePasswordExpired(
    repository: UserDoc,
    passwordExpired: Date,
    options?: IDatabaseSaveOptions,
  ): Promise<UserDoc>;
  createPhotoFilename(): Promise<Record<string, any>>;
  payloadSerialization(data: IUserDoc): Promise<any>;
  deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean>;
}
