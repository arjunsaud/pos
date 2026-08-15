import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const CATEGORY_DEFAULT_PER_PAGE = 20;
export const CATEGORY_DEFAULT_ORDER_BY = 'createdAt';
export const CATEGORY_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const CATEGORY_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'name', 'description'];
export const CATEGORY_DEFAULT_AVAILABLE_SEARCH = ['name', 'description'];
export const CATEGORY_DEFAULT_IS_ACTIVE = [true, false];
