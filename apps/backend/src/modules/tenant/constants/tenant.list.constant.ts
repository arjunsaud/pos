import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

export const TENANT_DEFAULT_PER_PAGE = 20;
export const TENANT_DEFAULT_ORDER_BY = 'createdAt';
export const TENANT_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const TENANT_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt', 'name', 'email', 'domain'];
export const TENANT_DEFAULT_AVAILABLE_SEARCH = ['name', 'email', 'domain', 'ownerName', 'phone'];
export const TENANT_DEFAULT_IS_ACTIVE = [true, false];
