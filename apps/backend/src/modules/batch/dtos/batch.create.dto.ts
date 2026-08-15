import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IBatchEntity } from '../interfaces/batch.entity.interface';

export class BatchCreateDto implements IBatchEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'productId',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    required: true,
    description: 'productName',
  })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    required: true,
    description: 'sku',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    required: true,
    description: 'batchNumber',
  })
  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @ApiProperty({
    required: true,
    description: 'quantity',
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: true,
    description: 'remainingQty',
  })
  @IsNumber()
  remainingQty: number;

  @ApiProperty({
    required: false,
    description: 'costPrice',
  })
  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @ApiProperty({
    required: false,
    description: 'mfgDate',
  })
  @IsOptional()
  @IsString()
  mfgDate?: string;

  @ApiProperty({
    required: false,
    description: 'expiryDate',
  })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: false,
    description: 'receivedDate',
  })
  @IsOptional()
  @IsString()
  receivedDate?: string;

  @ApiProperty({
    required: false,
    description: 'outletId',
  })
  @IsOptional()
  @IsString()
  outletId?: string;
}
