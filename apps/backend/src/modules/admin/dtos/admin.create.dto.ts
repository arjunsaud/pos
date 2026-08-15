import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';
import { IsPasswordStrong } from 'src/common/request/validations/request.is-password-strong.validation';
import { ENUM_ADMIN_ROLE } from '../constants/admin.enum.constant';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { ENUM_GENDER } from '../constants/admin.gender.enum.constant';

export class AdminCreateDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Type(() => String)
  readonly email: string;

  @ApiProperty({
    example: faker.person.firstName(),
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Type(() => String)
  readonly fullName: string;

  @ApiProperty({
    example: faker.person.firstName(),
    required: true,
  })
  @IsOptional()
  @IsEnum(ENUM_ADMIN_ROLE)
  @Type(() => String)
  readonly role?: string;

  @ApiProperty({
    example: ENUM_GENDER.FEMALE,
    required: true,
  })
  @IsOptional()
  @IsEnum(ENUM_GENDER)
  @Type(() => String)
  readonly gender?: ENUM_GENDER;

  @ApiProperty({
    example: `9876543210`,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  @Type(() => String)
  readonly mobileNumber?: string;

  @ApiProperty({
    description: 'string password',
    example: `Test@123`,
    required: true,
  })
  @IsNotEmpty()
  @IsPasswordStrong()
  @MaxLength(50)
  readonly password: string;

  @ApiProperty({
    type: AwsS3Serialization,
    required: false,
  })
  @IsOptional()
  @Type(() => AwsS3Serialization)
  photo?: AwsS3Serialization;

  @ApiProperty({
    description: 'User date of birth (must be at least 18 years old)',
    example: '1998-05-21',
    required: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'DOB must be a valid date' })
  @MinDate(new Date('1900-01-01'), {
    message: 'DOB cannot be before 1900',
  })
  @MaxDate(new Date(new Date().setFullYear(new Date().getFullYear() - 0)), {
    message: 'User must be at least 1 years old',
  })
  dob?: string;
}
