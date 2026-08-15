import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IContentEntity } from '../interfaces/content.entity.interface';

export class ContentCreateDto implements IContentEntity {
  @ApiProperty({
    required: true,
    description: 'key',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    required: true,
    description: 'title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    required: true,
    description: 'body',
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
