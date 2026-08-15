import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class OTPResetPasswordDto {
  @ApiProperty({
    example: faker.phone.number(),
    required: false,
  })
  @IsOptional()
  mobileNumber: string;

  @ApiProperty({
    example: faker.internet.email(),
    required: false,
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'Test@123#',
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
