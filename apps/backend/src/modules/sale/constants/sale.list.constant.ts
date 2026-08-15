import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const SALE_DEFAULT_PER_PAGE = 20;
export const SALE_DEFAULT_ORDER_BY = 'createdAt';
export const SALE_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const SALE_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'invoiceNumber', 'customerName', 'staffName'];
export const SALE_DEFAULT_AVAILABLE_SEARCH = ['invoiceNumber', 'customerName', 'staffName', 'paymentMethod'];
export const SALE_DEFAULT_IS_ACTIVE = [true, false];
