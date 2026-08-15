import { Types } from 'mongoose';
import {
  UserDoc,
  UserEntity,
} from 'src/modules/user/repository/entities/user.entity';
import { ENUM_GENDER } from '../constants/user.gender.enum.constant';

export interface IUserEntity extends Omit<UserEntity, 'role'> {}

export interface IUserDoc extends Omit<UserDoc, 'role'> {}

export interface IUser {
  _id: Types.ObjectId | string;
  username?: string;
  fullName: string;
  dob?: string;
  gender?: ENUM_GENDER;
  mobileNumber?: string;
  email: string;
  password: string;
  passwordExpired: Date;
  passwordCreated: Date;
  passwordAttempt: number;
  salt: string;
  isActive: boolean;
  photo?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
