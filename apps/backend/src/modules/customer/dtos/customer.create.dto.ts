import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ICustomerEntity } from '../interfaces/customer.entity.interface';

export class CustomerCreateDto implements ICustomerEntity {
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
    required: false,
    description: 'email',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    required: true,
    description: 'phone',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    required: false,
    description: 'pan',
  })
  @IsOptional()
  @IsString()
  pan?: string;

  @ApiProperty({
    required: false,
    description: 'address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    required: false,
    description: 'totalPurchases',
  })
  @IsOptional()
  @IsNumber()
  totalPurchases?: number;

  @ApiProperty({
    required: false,
    description: 'totalSpent',
  })
  @IsOptional()
  @IsNumber()
  totalSpent?: number;

  @ApiProperty({
    required: false,
    description: 'lastVisit',
  })
  @IsOptional()
  @IsString()
  lastVisit?: string;

  @ApiProperty({
    required: false,
    description: 'isActive',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    required: false,
    description: 'loyaltyPoints',
  })
  @IsOptional()
  @IsNumber()
  loyaltyPoints?: number;

  @ApiProperty({
    required: false,
    description: 'creditBalance',
  })
  @IsOptional()
  @IsNumber()
  creditBalance?: number;

  @ApiProperty({
    required: false,
    description: 'creditLimit',
  })
  @IsOptional()
  @IsNumber()
  creditLimit?: number;
}
