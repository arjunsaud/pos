import { faker } from '@faker-js/faker';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FilesUploadDTO,
  FileUploadDTO,
  UPLOAD_FOLDER_ENUM,
} from './docs/upload.doc';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async createPhotoFilename(path): Promise<Record<string, any>> {
    const filename: string = this.random(20);

    return {
      path: path,
      filename: filename,
    };
  }

  random(length: number, options?): string {
    const rString = options?.safe
      ? faker.internet.password({
          length,
          memorable: true,
          pattern: /[A-Z]/,
          prefix: options?.prefix,
        })
      : faker.internet.password({
          length,
          memorable: true,
          pattern: /\w/,
          prefix: options?.prefix,
        });

    return options?.upperCase ? rString.toUpperCase() : rString;
  }

  isValidObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  }

  getPath(body: FileUploadDTO | FilesUploadDTO): string {
    let path: string;
    switch (body.folder) {
      case UPLOAD_FOLDER_ENUM.BANNER: {
        path = UPLOAD_FOLDER_ENUM.BANNER;
        break;
      }
      case UPLOAD_FOLDER_ENUM.ADMIN: {
        path = UPLOAD_FOLDER_ENUM.ADMIN;
        break;
      }
      case UPLOAD_FOLDER_ENUM.SERVICES: {
        path = UPLOAD_FOLDER_ENUM.SERVICES;
        break;
      }
      case UPLOAD_FOLDER_ENUM.USER: {
        path = UPLOAD_FOLDER_ENUM.USER;
        break;
      }
      case UPLOAD_FOLDER_ENUM.ADMIN: {
        path = UPLOAD_FOLDER_ENUM.ADMIN;
        break;
      }
      case UPLOAD_FOLDER_ENUM.TESTIMONIALS: {
        path = UPLOAD_FOLDER_ENUM.TESTIMONIALS;
        break;
      }
      case UPLOAD_FOLDER_ENUM.CITY: {
        path = UPLOAD_FOLDER_ENUM.CITY;
        break;
      }
      case UPLOAD_FOLDER_ENUM.TEAMS: {
        path = UPLOAD_FOLDER_ENUM.TEAMS;
        break;
      }
      case UPLOAD_FOLDER_ENUM.PAGES: {
        path = UPLOAD_FOLDER_ENUM.PAGES;
        break;
      }
      default: {
        throw new HttpException(
          'upload.error.invalidFolder',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return path;
  }
}
