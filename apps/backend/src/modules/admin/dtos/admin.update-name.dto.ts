import { PickType } from '@nestjs/swagger';
import { AdminCreateDto } from './admin.create.dto';

export class AdminUpdateNameDto extends PickType(AdminCreateDto, [
  'fullName',
  'dob',
  'gender',
  'photo',
] as const) {}
