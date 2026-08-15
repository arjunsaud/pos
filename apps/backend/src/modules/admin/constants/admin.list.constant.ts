import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const ADMIN_DEFAULT_PER_PAGE = 20;
export const ADMIN_DEFAULT_ORDER_BY = 'createdAt';
export const ADMIN_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const ADMIN_DEFAULT_AVAILABLE_ORDER_BY = [
  'username',
  'firstName',
  'lastName',
  'email',
  'mobileNumber',
  'createdAt',
];
export const ADMIN_DEFAULT_AVAILABLE_SEARCH = [
  'username',
  'firstName',
  'lastName',
  'email',
  'mobileNumber',
];

export const ADMIN_DEFAULT_IS_ACTIVE = [true, false];
export const ADMIN_DEFAULT_BLOCKED = [true, false];
export const ADMIN_DEFAULT_INACTIVE_PERMANENT = [true, false];
