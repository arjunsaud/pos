import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const PURCHASE_DEFAULT_PER_PAGE = 20;
export const PURCHASE_DEFAULT_ORDER_BY = 'createdAt';
export const PURCHASE_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const PURCHASE_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'orderNumber', 'vendorName', 'createdBy'];
export const PURCHASE_DEFAULT_AVAILABLE_SEARCH = ['orderNumber', 'vendorName', 'createdBy'];
export const PURCHASE_DEFAULT_IS_ACTIVE = [true, false];
