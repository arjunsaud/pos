import { PartialType } from '@nestjs/swagger';
import { NotificationCreateDto } from './notification.create.dto';

export class NotificationUpdateDto extends PartialType(NotificationCreateDto) {}
