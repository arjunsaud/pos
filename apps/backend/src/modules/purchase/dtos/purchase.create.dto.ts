import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IPurchaseEntity } from '../interfaces/purchase.entity.interface';

export class PurchaseCreateDto implements IPurchaseEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'orderNumber',
  })
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @ApiProperty({
    required: true,
    description: 'vendorId',
  })
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty({
    required: true,
    description: 'vendorName',
  })
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty({
    required: true,
    description: 'items',
  })
  @IsArray()
  items: Record<string, any>[];

  @ApiProperty({
    required: true,
    description: 'subtotal',
  })
  @IsNumber()
  subtotal: number;

  @ApiProperty({
    required: false,
    description: 'vatAmount',
  })
  @IsOptional()
  @IsNumber()
  vatAmount?: number;

  @ApiProperty({
    required: true,
    description: 'total',
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: true,
    description: 'orderDate',
  })
  @IsString()
  @IsNotEmpty()
  orderDate: string;

  @ApiProperty({
    required: false,
    description: 'expectedDate',
  })
  @IsOptional()
  @IsString()
  expectedDate?: string;

  @ApiProperty({
    required: false,
    description: 'receivedDate',
  })
  @IsOptional()
  @IsString()
  receivedDate?: string;

  @ApiProperty({
    required: false,
    description: 'notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    required: false,
    description: 'createdBy',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
