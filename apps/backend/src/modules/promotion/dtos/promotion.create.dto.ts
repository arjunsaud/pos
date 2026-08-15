import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IPromotionEntity } from '../interfaces/promotion.entity.interface';

export class PromotionCreateDto implements IPromotionEntity {
  @ApiProperty({
    required: true,
    description: 'code',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    required: true,
    description: 'name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'type',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    required: true,
    description: 'value',
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: false,
    description: 'maxUses',
  })
  @IsOptional()
  @IsNumber()
  maxUses?: number;

  @ApiProperty({
    required: false,
    description: 'usedCount',
  })
  @IsOptional()
  @IsNumber()
  usedCount?: number;

  @ApiProperty({
    required: true,
    description: 'validFrom',
  })
  @IsString()
  @IsNotEmpty()
  validFrom: string;

  @ApiProperty({
    required: true,
    description: 'validUntil',
  })
  @IsString()
  @IsNotEmpty()
  validUntil: string;

  @ApiProperty({
    required: false,
    description: 'createdBy',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
