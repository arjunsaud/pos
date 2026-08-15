import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IProductEntity } from '../interfaces/product.entity.interface';

export class ProductCreateDto implements IProductEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: 'sku',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    required: false,
    description: 'barcode',
  })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({
    required: true,
    description: 'price',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: false,
    description: 'costPrice',
  })
  @IsOptional()
  @IsNumber()
  costPrice?: number;

  @ApiProperty({
    required: true,
    description: 'category',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    required: false,
    description: 'stock',
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({
    required: false,
    description: 'minStock',
  })
  @IsOptional()
  @IsNumber()
  minStock?: number;

  @ApiProperty({
    required: true,
    description: 'unit',
  })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({
    required: false,
    description: 'isActive',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    required: false,
    description: 'image',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    required: false,
    description: 'vendorId',
  })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({
    required: false,
    description: 'vendorName',
  })
  @IsOptional()
  @IsString()
  vendorName?: string;

  @ApiProperty({
    required: false,
    description: 'outletId',
  })
  @IsOptional()
  @IsString()
  outletId?: string;

  @ApiProperty({
    required: false,
    description: 'hasBatchTracking',
  })
  @IsOptional()
  @IsBoolean()
  hasBatchTracking?: boolean;
}
