import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

export class PageSettingsDto {
  @ApiProperty({
    example: 'aboutUs',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  key: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: AwsS3Serialization,
    required: true,
    example: {
      path: faker.system.directoryPath(),
      pathWithFilename: `${faker.system.directoryPath()}/${faker.system.fileName()}`,
      filename: faker.system.fileName(),
      completedUrl: faker.internet.url(),
      baseUrl: faker.internet.url(),
      mime: faker.system.mimeType(),
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AwsS3Serialization)
  photo: AwsS3Serialization;

  @ApiProperty({
    example: 'About Us',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  title: string;

  @ApiProperty({
    example: faker.lorem.sentence(),
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  shortDescription?: string;

  @ApiProperty({
    example: faker.lorem.paragraph(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  description: string;
}

export class UpdateMaintenanceModeDto {
  @ApiProperty({
    example: false,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  maintenanceMode: boolean;
}

export class UpdatePagesDto {
  @ApiProperty({
    type: [PageSettingsDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageSettingsDto)
  pages: PageSettingsDto[];
}
