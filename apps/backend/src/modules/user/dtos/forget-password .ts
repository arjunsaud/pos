import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({
    example: 'arjun@kushfintech.com',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;
}
