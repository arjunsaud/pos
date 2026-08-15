import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ISubscriptionEntity } from '../interfaces/subscription.entity.interface';

export class SubscriptionCreateDto implements ISubscriptionEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'tenantName',
  })
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty({
    required: true,
    description: 'packageId',
  })
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty({
    required: true,
    description: 'packageName',
  })
  @IsString()
  @IsNotEmpty()
  packageName: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: true,
    description: 'startDate',
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    required: true,
    description: 'endDate',
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    required: true,
    description: 'amount',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    description: 'currency',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    required: false,
    description: 'autoRenew',
  })
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
