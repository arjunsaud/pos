import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const VENDOR_DEFAULT_PER_PAGE = 20;
export const VENDOR_DEFAULT_ORDER_BY = 'createdAt';
export const VENDOR_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const VENDOR_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'name', 'email', 'phone'];
export const VENDOR_DEFAULT_AVAILABLE_SEARCH = ['name', 'email', 'phone', 'contactPerson', 'pan'];
export const VENDOR_DEFAULT_IS_ACTIVE = [true, false];
