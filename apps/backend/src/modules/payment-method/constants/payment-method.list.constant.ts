import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const PAYMENT_METHOD_DEFAULT_PER_PAGE = 20;
export const PAYMENT_METHOD_DEFAULT_ORDER_BY = 'createdAt';
export const PAYMENT_METHOD_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const PAYMENT_METHOD_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'name', 'type'];
export const PAYMENT_METHOD_DEFAULT_AVAILABLE_SEARCH = ['name', 'type'];
export const PAYMENT_METHOD_DEFAULT_IS_ACTIVE = [true, false];
