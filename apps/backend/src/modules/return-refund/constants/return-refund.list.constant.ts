import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const RETURN_REFUND_DEFAULT_PER_PAGE = 20;
export const RETURN_REFUND_DEFAULT_ORDER_BY = 'createdAt';
export const RETURN_REFUND_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const RETURN_REFUND_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'returnNumber', 'invoiceNumber', 'customerName'];
export const RETURN_REFUND_DEFAULT_AVAILABLE_SEARCH = ['returnNumber', 'invoiceNumber', 'customerName'];
export const RETURN_REFUND_DEFAULT_IS_ACTIVE = [true, false];
