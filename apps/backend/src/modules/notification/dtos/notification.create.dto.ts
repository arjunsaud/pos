import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { INotificationEntity } from '../interfaces/notification.entity.interface';

export class NotificationCreateDto implements INotificationEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'type',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    required: true,
    description: 'title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: true,
    description: 'message',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    required: true,
    description: 'priority',
  })
  @IsString()
  @IsNotEmpty()
  priority: string;

  @ApiProperty({
    required: false,
    description: 'isRead',
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({
    required: false,
    description: 'actionUrl',
  })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiProperty({
    required: false,
    description: 'entityId',
  })
  @IsOptional()
  @IsString()
  entityId?: string;
}
