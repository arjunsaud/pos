import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ITemplateEntity } from '../interfaces/template.entity.interface';

export class TemplateCreateDto implements ITemplateEntity {
  @ApiProperty({ enum: ['invoice', 'receipt'] })
  @IsIn(['invoice', 'receipt'])
  type: 'invoice' | 'receipt';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Rich HTML with {{placeholders}} such as {{storeName}} and {{#items}}...{{/items}}',
  })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiProperty({ required: false, default: 'a4' })
  @IsString()
  @IsOptional()
  paperSize: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
