import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IOutletEntity } from '../interfaces/outlet.entity.interface';

export class OutletCreateDto implements IOutletEntity {
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
    description: 'address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    required: true,
    description: 'city',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    required: true,
    description: 'phone',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    required: false,
    description: 'isDefault',
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}
