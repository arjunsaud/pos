import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IFeatureEntity } from '../interfaces/feature.entity.interface';

export class FeatureCreateDto implements IFeatureEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'key',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    required: true,
    description: 'label',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    required: false,
    description: 'description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'category',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    required: false,
    description: 'enabled',
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
