import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const TEMPLATE_DEFAULT_PER_PAGE = 20;
export const TEMPLATE_DEFAULT_ORDER_BY = 'createdAt';
export const TEMPLATE_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const TEMPLATE_DEFAULT_AVAILABLE_ORDER_BY = [
  'createdAt',
  'name',
  'type',
];
export const TEMPLATE_DEFAULT_AVAILABLE_SEARCH = ['name', 'type'];
