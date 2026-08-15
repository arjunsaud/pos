import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IStockMovementEntity } from '../interfaces/stock-movement.entity.interface';

export class StockMovementCreateDto implements IStockMovementEntity {
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
    description: 'type',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    required: true,
    description: 'quantity',
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: false,
    description: 'reason',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    required: false,
    description: 'performedBy',
  })
  @IsOptional()
  @IsString()
  performedBy?: string;

  @ApiProperty({
    required: false,
    description: 'outletId',
  })
  @IsOptional()
  @IsString()
  outletId?: string;
}
