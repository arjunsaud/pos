import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const STOCK_MOVEMENT_DEFAULT_PER_PAGE = 20;
export const STOCK_MOVEMENT_DEFAULT_ORDER_BY = 'createdAt';
export const STOCK_MOVEMENT_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const STOCK_MOVEMENT_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'productName', 'reason', 'performedBy'];
export const STOCK_MOVEMENT_DEFAULT_AVAILABLE_SEARCH = ['productName', 'reason', 'performedBy'];
export const STOCK_MOVEMENT_DEFAULT_IS_ACTIVE = [true, false];
