import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IDocumentEntity } from '../interfaces/document.entity.interface';

export class DocumentCreateDto implements IDocumentEntity {
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
    required: true,
    description: 'fileName',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    required: false,
    description: 'fileSize',
  })
  @IsOptional()
  @IsString()
  fileSize?: string;

  @ApiProperty({
    required: true,
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}
