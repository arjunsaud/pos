import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IPackageEntity } from '../interfaces/package.entity.interface';

export class PackageCreateDto implements IPackageEntity {
  @ApiProperty({
    required: true,
    description: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: 'price',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
    description: 'interval',
  })
  @IsString()
  @IsNotEmpty()
  interval: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: true,
    description: 'maxProducts',
  })
  @IsNumber()
  maxProducts: number;

  @ApiProperty({
    required: true,
    description: 'maxStaff',
  })
  @IsNumber()
  maxStaff: number;

  @ApiProperty({
    required: true,
    description: 'maxOutlets',
  })
  @IsNumber()
  maxOutlets: number;

  @ApiProperty({
    required: true,
    description: 'analytics',
  })
  @IsString()
  @IsNotEmpty()
  analytics: string;

  @ApiProperty({
    required: true,
    description: 'support',
  })
  @IsString()
  @IsNotEmpty()
  support: string;

  @ApiProperty({
    required: false,
    description: 'paymentGateway',
  })
  @IsOptional()
  @IsBoolean()
  paymentGateway?: boolean;

  @ApiProperty({
    required: false,
    description: 'billing',
  })
  @IsOptional()
  @IsBoolean()
  billing?: boolean;

  @ApiProperty({
    required: false,
    description: 'receipt',
  })
  @IsOptional()
  @IsBoolean()
  receipt?: boolean;

  @ApiProperty({
    required: false,
    description: 'canExport',
  })
  @IsOptional()
  @IsBoolean()
  canExport?: boolean;

  @ApiProperty({
    required: false,
    description: 'inventory',
  })
  @IsOptional()
  @IsBoolean()
  inventory?: boolean;

  @ApiProperty({
    required: false,
    description: 'skuManagement',
  })
  @IsOptional()
  @IsBoolean()
  skuManagement?: boolean;

  @ApiProperty({
    required: false,
    description: 'pos',
  })
  @IsOptional()
  @IsBoolean()
  pos?: boolean;

  @ApiProperty({
    required: false,
    description: 'multipleOutlets',
  })
  @IsOptional()
  @IsBoolean()
  multipleOutlets?: boolean;

  @ApiProperty({
    required: false,
    description: 'vendors',
  })
  @IsOptional()
  @IsBoolean()
  vendors?: boolean;

  @ApiProperty({
    required: false,
    description: 'invoicePrinting',
  })
  @IsOptional()
  @IsBoolean()
  invoicePrinting?: boolean;

  @ApiProperty({
    required: false,
    description: 'trainingAndSupport',
  })
  @IsOptional()
  @IsBoolean()
  trainingAndSupport?: boolean;

  @ApiProperty({
    required: false,
    description: 'customDomain',
  })
  @IsOptional()
  @IsBoolean()
  customDomain?: boolean;

  @ApiProperty({
    required: false,
    description: 'dailyBackup',
  })
  @IsOptional()
  @IsBoolean()
  dailyBackup?: boolean;

  @ApiProperty({
    required: false,
    description: 'popular',
  })
  @IsOptional()
  @IsBoolean()
  popular?: boolean;
}
