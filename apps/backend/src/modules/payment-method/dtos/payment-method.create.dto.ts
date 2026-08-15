import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IPaymentMethodEntity } from '../interfaces/payment-method.entity.interface';

export class PaymentMethodCreateDto implements IPaymentMethodEntity {
  @ApiProperty({
    required: true,
    description: 'type',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

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
    required: false,
    description: 'enabled',
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    required: false,
    description: 'accountDetails',
  })
  @IsOptional()
  @IsString()
  accountDetails?: string;

  @ApiProperty({
    required: false,
    description: 'qrCodeUrl',
  })
  @IsOptional()
  @IsString()
  qrCodeUrl?: string;
}
