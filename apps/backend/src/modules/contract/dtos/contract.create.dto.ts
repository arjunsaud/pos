import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IContractEntity } from '../interfaces/contract.entity.interface';

export class ContractCreateDto implements IContractEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
