import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IInventoryEntity } from '../interfaces/inventory.entity.interface';

export class InventoryCreateDto implements IInventoryEntity {
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
    description: 'currentStock',
  })
  @IsNumber()
  currentStock: number;

  @ApiProperty({
    required: false,
    description: 'minStock',
  })
  @IsOptional()
  @IsNumber()
  minStock?: number;

  @ApiProperty({
    required: false,
    description: 'outletId',
  })
  @IsOptional()
  @IsString()
  outletId?: string;
}
