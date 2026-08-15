import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IReferralEntity } from '../interfaces/referral.entity.interface';

export class ReferralCreateDto implements IReferralEntity {
  @ApiProperty({
    required: true,
    description: 'referrerTenantId',
  })
  @IsString()
  @IsNotEmpty()
  referrerTenantId: string;

  @ApiProperty({
    required: true,
    description: 'referrerTenantName',
  })
  @IsString()
  @IsNotEmpty()
  referrerTenantName: string;

  @ApiProperty({
    required: true,
    description: 'referredTenantId',
  })
  @IsString()
  @IsNotEmpty()
  referredTenantId: string;

  @ApiProperty({
    required: true,
    description: 'referredTenantName',
  })
  @IsString()
  @IsNotEmpty()
  referredTenantName: string;

  @ApiProperty({
    required: true,
    description: 'referralCode',
  })
  @IsString()
  @IsNotEmpty()
  referralCode: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: true,
    description: 'rewardType',
  })
  @IsString()
  @IsNotEmpty()
  rewardType: string;

  @ApiProperty({
    required: true,
    description: 'rewardValue',
  })
  @IsNumber()
  rewardValue: number;

  @ApiProperty({
    required: false,
    description: 'convertedAt',
  })
  @IsOptional()
  @IsString()
  convertedAt?: string;
}
