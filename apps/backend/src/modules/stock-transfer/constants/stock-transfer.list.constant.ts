import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const STOCK_TRANSFER_DEFAULT_PER_PAGE = 20;
export const STOCK_TRANSFER_DEFAULT_ORDER_BY = 'createdAt';
export const STOCK_TRANSFER_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const STOCK_TRANSFER_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'transferNumber', 'fromOutletName', 'toOutletName'];
export const STOCK_TRANSFER_DEFAULT_AVAILABLE_SEARCH = ['transferNumber', 'fromOutletName', 'toOutletName', 'reason'];
export const STOCK_TRANSFER_DEFAULT_IS_ACTIVE = [true, false];
