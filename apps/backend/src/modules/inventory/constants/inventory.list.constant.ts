import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const INVENTORY_DEFAULT_PER_PAGE = 20;
export const INVENTORY_DEFAULT_ORDER_BY = 'createdAt';
export const INVENTORY_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const INVENTORY_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'productName', 'sku'];
export const INVENTORY_DEFAULT_AVAILABLE_SEARCH = ['productName', 'sku'];
export const INVENTORY_DEFAULT_IS_ACTIVE = [true, false];
