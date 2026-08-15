import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const FEATURE_DEFAULT_PER_PAGE = 20;
export const FEATURE_DEFAULT_ORDER_BY = 'createdAt';
export const FEATURE_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const FEATURE_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'key', 'label', 'category'];
export const FEATURE_DEFAULT_AVAILABLE_SEARCH = ['key', 'label', 'category'];
export const FEATURE_DEFAULT_IS_ACTIVE = [true, false];
