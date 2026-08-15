import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const OUTLET_DEFAULT_PER_PAGE = 20;
export const OUTLET_DEFAULT_ORDER_BY = 'createdAt';
export const OUTLET_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const OUTLET_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'name', 'city', 'address'];
export const OUTLET_DEFAULT_AVAILABLE_SEARCH = ['name', 'city', 'address', 'phone'];
export const OUTLET_DEFAULT_IS_ACTIVE = [true, false];
