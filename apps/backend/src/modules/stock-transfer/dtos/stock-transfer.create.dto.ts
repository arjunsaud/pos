import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IStockTransferEntity } from '../interfaces/stock-transfer.entity.interface';

export class StockTransferCreateDto implements IStockTransferEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'transferNumber',
  })
  @IsString()
  @IsNotEmpty()
  transferNumber: string;

  @ApiProperty({
    required: true,
    description: 'fromOutletId',
  })
  @IsString()
  @IsNotEmpty()
  fromOutletId: string;

  @ApiProperty({
    required: true,
    description: 'fromOutletName',
  })
  @IsString()
  @IsNotEmpty()
  fromOutletName: string;

  @ApiProperty({
    required: true,
    description: 'toOutletId',
  })
  @IsString()
  @IsNotEmpty()
  toOutletId: string;

  @ApiProperty({
    required: true,
    description: 'toOutletName',
  })
  @IsString()
  @IsNotEmpty()
  toOutletName: string;

  @ApiProperty({
    required: true,
    description: 'items',
  })
  @IsArray()
  items: Record<string, any>[];

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
    description: 'completedAt',
  })
  @IsOptional()
  @IsString()
  completedAt?: string;

  @ApiProperty({
    required: false,
    description: 'createdBy',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    required: false,
    description: 'notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
