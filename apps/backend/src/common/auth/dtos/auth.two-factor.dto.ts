import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AuthOtpDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 8)
  otp: string;
}

export class AuthTwoFaActionDto {
  @ApiProperty({ enum: ['enable', 'disable'] })
  @IsIn(['enable', 'disable'])
  action: 'enable' | 'disable';
}

export class AuthTwoFaConfirmDto extends AuthTwoFaActionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 8)
  otp: string;
}
