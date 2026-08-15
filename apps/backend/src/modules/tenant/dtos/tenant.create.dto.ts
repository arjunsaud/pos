import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ITenantEntity } from '../interfaces/tenant.entity.interface';

export class TenantCreateDto implements ITenantEntity {
  @ApiProperty({
    required: true,
    description: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: 'email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    description: 'phone',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    required: true,
    description: 'plan',
  })
  @IsString()
  @IsNotEmpty()
  plan: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: true,
    description: 'domain',
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({
    required: true,
    description: 'ownerName',
  })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({
    required: false,
    description: 'productCount',
  })
  @IsOptional()
  @IsNumber()
  productCount?: number;

  @ApiProperty({
    required: false,
    description: 'monthlyRevenue',
  })
  @IsOptional()
  @IsNumber()
  monthlyRevenue?: number;

  @ApiProperty({
    required: false,
    description: 'address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    required: false,
    description: 'pan',
  })
  @IsOptional()
  @IsString()
  pan?: string;

  @ApiProperty({
    required: false,
    description: 'vatNumber',
  })
  @IsOptional()
  @IsString()
  vatNumber?: string;
}
