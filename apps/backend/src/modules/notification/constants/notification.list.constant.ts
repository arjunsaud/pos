import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const NOTIFICATION_DEFAULT_PER_PAGE = 20;
export const NOTIFICATION_DEFAULT_ORDER_BY = 'createdAt';
export const NOTIFICATION_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'title', 'message', 'type'];
export const NOTIFICATION_DEFAULT_AVAILABLE_SEARCH = ['title', 'message', 'type'];
export const NOTIFICATION_DEFAULT_IS_ACTIVE = [true, false];
