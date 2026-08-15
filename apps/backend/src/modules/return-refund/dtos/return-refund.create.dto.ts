import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IReturnRefundEntity } from '../interfaces/return-refund.entity.interface';

export class ReturnRefundCreateDto implements IReturnRefundEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'returnNumber',
  })
  @IsString()
  @IsNotEmpty()
  returnNumber: string;

  @ApiProperty({
    required: true,
    description: 'saleId',
  })
  @IsString()
  @IsNotEmpty()
  saleId: string;

  @ApiProperty({
    required: true,
    description: 'invoiceNumber',
  })
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({
    required: false,
    description: 'customerName',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    required: true,
    description: 'items',
  })
  @IsArray()
  items: Record<string, any>[];

  @ApiProperty({
    required: true,
    description: 'refundAmount',
  })
  @IsNumber()
  refundAmount: number;

  @ApiProperty({
    required: true,
    description: 'refundMethod',
  })
  @IsString()
  @IsNotEmpty()
  refundMethod: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: false,
    description: 'reason',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    required: false,
    description: 'processedBy',
  })
  @IsOptional()
  @IsString()
  processedBy?: string;

  @ApiProperty({
    required: false,
    description: 'processedAt',
  })
  @IsOptional()
  @IsString()
  processedAt?: string;
}
