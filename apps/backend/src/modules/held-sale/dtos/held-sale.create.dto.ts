import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IHeldSaleEntity } from '../interfaces/held-sale.entity.interface';

export class HeldSaleCreateDto implements IHeldSaleEntity {
  @ApiProperty({
    required: true,
    description: 'tenantId',
  })
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({
    required: true,
    description: 'cart',
  })
  @IsArray()
  cart: Record<string, any>[];

  @ApiProperty({
    required: false,
    description: 'customerName',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({
    required: true,
    description: 'heldAt',
  })
  @IsString()
  @IsNotEmpty()
  heldAt: string;

  @ApiProperty({
    required: true,
    description: 'total',
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    required: false,
    description: 'outletId',
  })
  @IsOptional()
  @IsString()
  outletId?: string;
}
