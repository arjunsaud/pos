import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ISaleEntity } from '../interfaces/sale.entity.interface';

export class SaleCreateDto implements ISaleEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

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
    required: false,
    description: 'customerPAN',
  })
  @IsOptional()
  @IsString()
  customerPAN?: string;

  @ApiProperty({
    required: false,
    description: 'customerId',
  })
  @IsOptional()
  @IsString()
  customerId?: string;

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
    description: 'discount',
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    required: false,
    description: 'vatAmount',
  })
  @IsOptional()
  @IsNumber()
  vatAmount?: number;

  @ApiProperty({
    required: false,
    description: 'vatPercent',
  })
  @IsOptional()
  @IsNumber()
  vatPercent?: number;

  @ApiProperty({
    required: true,
    description: 'total',
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    required: true,
    description: 'paymentMethod',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: false,
    description: 'staffName',
  })
  @IsOptional()
  @IsString()
  staffName?: string;

  @ApiProperty({
    required: false,
    description: 'outletId',
  })
  @IsOptional()
  @IsString()
  outletId?: string;
}
