import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const CONTRACT_DEFAULT_PER_PAGE = 20;
export const CONTRACT_DEFAULT_ORDER_BY = 'createdAt';
export const CONTRACT_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const CONTRACT_DEFAULT_AVAILABLE_ORDER_BY = [
  'createdAt',
  'title',
  'tenantName',
  'status',
];
export const CONTRACT_DEFAULT_AVAILABLE_SEARCH = [
  'title',
  'tenantName',
  'type',
  'status',
];
export const CONTRACT_DEFAULT_IS_ACTIVE = [true, false];
