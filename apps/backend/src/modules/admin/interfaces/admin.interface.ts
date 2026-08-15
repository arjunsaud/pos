import {
  AdminDoc,
  AdminEntity,
} from 'src/modules/admin/repository/entities/admin.entity';

export interface IAdminEntity extends Omit<AdminEntity, 'role'> {}

export interface IAdminDoc extends Omit<AdminDoc, 'role'> {}
