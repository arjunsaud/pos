import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UserStaffUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tenantStaffRole?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  permissions?: string[];
}
