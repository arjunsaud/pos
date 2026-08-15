import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const MAILER_LOG_DEFAULT_PER_PAGE = 20;
export const MAILER_LOG_DEFAULT_ORDER_BY = 'createdAt';
export const MAILER_LOG_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const MAILER_LOG_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt'];
export const MAILER_LOG_DEFAULT_AVAILABLE_SEARCH = ['username'];

export const MAILER_LOG_DEFAULT_IS_ACTIVE = [true, false];
export const MAILER_LOG_DEFAULT_BLOCKED = [true, false];
export const MAILER_LOG_DEFAULT_INACTIVE_PERMANENT = [true, false];
