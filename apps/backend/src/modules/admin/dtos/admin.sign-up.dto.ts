import { OmitType } from '@nestjs/swagger';
import { AdminCreateDto } from './admin.create.dto';

export class AdminSignUpDto extends OmitType(AdminCreateDto, ['role'] as const) {}
