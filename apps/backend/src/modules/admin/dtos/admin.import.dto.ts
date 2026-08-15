import { OmitType } from '@nestjs/swagger';
import { AdminCreateDto } from './admin.create.dto';

export class AdminImportDto extends OmitType(AdminCreateDto, [
  'role',
  'password',
] as const) {}
