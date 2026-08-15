import { PartialType } from '@nestjs/swagger';
import { ActivityLogCreateDto } from './activity-log.create.dto';

export class ActivityLogUpdateDto extends PartialType(ActivityLogCreateDto) {}
