import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({
    example: faker.number.int(1),
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  serviceCharge: number;

  @ApiProperty({
    example: faker.number.int(1),
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  partialPayment: number;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPartialPayment: boolean;


  @ApiProperty({
    example: 'privacy policy',
    required: false,
  })
  @IsOptional()
  @IsString()
  privacyPolicy: string;

  @ApiProperty({
    example: 'terms and conditions',
    required: false,
  })
  @IsOptional()
  @IsString()
  termsAndConditions: string;

  
}
