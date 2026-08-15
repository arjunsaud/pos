import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const SUBSCRIPTION_DEFAULT_PER_PAGE = 20;
export const SUBSCRIPTION_DEFAULT_ORDER_BY = 'createdAt';
export const SUBSCRIPTION_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const SUBSCRIPTION_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'tenantName', 'packageName', 'status'];
export const SUBSCRIPTION_DEFAULT_AVAILABLE_SEARCH = ['tenantName', 'packageName', 'status'];
export const SUBSCRIPTION_DEFAULT_IS_ACTIVE = [true, false];
