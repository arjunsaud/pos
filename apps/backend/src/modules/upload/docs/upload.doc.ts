import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  Doc,
  DocAuth,
  DocResponse,
} from 'src/common/doc/decorators/doc.decorator';

export enum UPLOAD_FOLDER_ENUM {
  BANNER = 'banners',
  SERVICES = 'services',
  ADMIN = 'admin',
  USER = 'users',
  TESTIMONIALS = 'testimonials',
  CITY = 'cities',
  TEAMS = 'teams',
  PAGES = 'pages',
}

export class FileUploadDTO {
  @ApiProperty({ type: 'string', enum: UPLOAD_FOLDER_ENUM })
  @IsEnum(UPLOAD_FOLDER_ENUM)
  @IsNotEmpty()
  @IsString()
  folder: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class FilesUploadDTO extends PickType(FileUploadDTO, ['folder']) {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'File uploads',
  })
  files: any;
}

export function UploadImageDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update profile photo',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: FileUploadDTO,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocResponse('user.upload', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}

export function UploadImagesDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update profile photo',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: FilesUploadDTO,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocResponse('user.upload', {
      httpStatus: HttpStatus.CREATED,
    }),
  );
}
