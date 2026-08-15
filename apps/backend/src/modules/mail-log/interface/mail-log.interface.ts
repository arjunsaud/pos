import { UserEntity } from 'src/modules/user/repository/entities/user.entity';

export interface IMailPayload {
  to?: string;
  subject?: string;
  text?: string;
  requestId?: string;
  user?: UserEntity;
}
