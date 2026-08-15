import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const PACKAGE_DEFAULT_PER_PAGE = 20;
export const PACKAGE_DEFAULT_ORDER_BY = 'createdAt';
export const PACKAGE_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const PACKAGE_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'name'];
export const PACKAGE_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const PACKAGE_DEFAULT_IS_ACTIVE = [true, false];
