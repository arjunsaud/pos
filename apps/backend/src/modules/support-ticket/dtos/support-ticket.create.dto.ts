import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ISupportTicketEntity } from '../interfaces/support-ticket.entity.interface';

export class SupportTicketCreateDto implements ISupportTicketEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'tenantName',
  })
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty({
    required: true,
    description: 'subject',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    required: true,
    description: 'description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    required: true,
    description: 'category',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    required: true,
    description: 'priority',
  })
  @IsString()
  @IsNotEmpty()
  priority: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: false,
    description: 'respondedAt',
  })
  @IsOptional()
  @IsString()
  respondedAt?: string;

  @ApiProperty({
    required: false,
    description: 'response',
  })
  @IsOptional()
  @IsString()
  response?: string;

  @ApiProperty({
    required: false,
    description: 'attachments',
  })
  @IsOptional()
  @IsArray()
  attachments?: string[];
}
