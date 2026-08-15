import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IActivityLogEntity } from '../interfaces/activity-log.entity.interface';

export class ActivityLogCreateDto implements IActivityLogEntity {
  @ApiProperty({
    required: false,
    description: 'tenantId',
  })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({
    required: true,
    description: 'user',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    required: true,
    description: 'action',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    required: false,
    description: 'details',
  })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiProperty({
    required: true,
    description: 'type',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}
