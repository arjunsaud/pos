import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IPaymentReceiptEntity } from '../interfaces/payment-receipt.entity.interface';

export class PaymentReceiptCreateDto implements IPaymentReceiptEntity {
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
    description: 'amount',
  })
  @IsNumber()
  amount: number;

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
    description: 'paymentMethod',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    required: false,
    description: 'receiptFile',
  })
  @IsOptional()
  @IsString()
  receiptFile?: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    required: false,
    description: 'uploadedAt',
  })
  @IsOptional()
  @IsString()
  uploadedAt?: string;

  @ApiProperty({
    required: false,
    description: 'reviewedAt',
  })
  @IsOptional()
  @IsString()
  reviewedAt?: string;

  @ApiProperty({
    required: false,
    description: 'reviewedBy',
  })
  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @ApiProperty({
    required: false,
    description: 'notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
