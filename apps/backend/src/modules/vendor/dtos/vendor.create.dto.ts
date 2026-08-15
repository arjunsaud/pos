import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IVendorEntity } from '../interfaces/vendor.entity.interface';

export class VendorCreateDto implements IVendorEntity {
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
    description: 'contactPerson',
  })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

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

  @ApiProperty({
    required: false,
    description: 'address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    required: false,
    description: 'city',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: false,
    description: 'productCount',
  })
  @IsOptional()
  @IsNumber()
  productCount?: number;
}
