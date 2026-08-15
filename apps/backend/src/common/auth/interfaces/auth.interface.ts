import {
  ENUM_AUTH_LOGIN_FROM,
  ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';
import { ACCOUNT_KIND } from 'src/common/enum/user.status.enum';

export interface IAuthPassword {
  salt: string;
  passwordHash: string;
  passwordExpired: Date;
  passwordCreated: Date;
}

export interface IAuthPayloadOptions {
  loginWith: ENUM_AUTH_LOGIN_WITH;
  loginFrom: ENUM_AUTH_LOGIN_FROM;
  loginDate: Date;
  kind: ACCOUNT_KIND;
  tenantId?: string;
}
