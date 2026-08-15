import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import {
  FileUploadMultiple,
  FileUploadSingle,
} from 'src/common/file/decorators/file.decorator';
import { IFile } from 'src/common/file/interfaces/file.interface';
import { FileRequiredPipe } from 'src/common/file/pipes/file.required.pipe';
import { FileSizeImagePipe } from 'src/common/file/pipes/file.size.pipe';
import { FileTypeImagePipe } from 'src/common/file/pipes/file.type.pipe';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import {
  FilesUploadDTO,
  FileUploadDTO,
  UploadImageDoc,
  UploadImagesDoc,
} from './docs/upload.doc';
import { UploadService } from './upload.service';
import { UserProtected } from '../user/decorators/user.decorator';
@ApiTags('File Upload')
@Controller({
  version: '1',
  path: '/upload',
})
export class UserUploadController {
  constructor(
    private readonly awsService: AwsS3Service,
    private readonly uploadService: UploadService,
  ) {}

  @UploadImageDoc()
  @ResponseSingle('user.upload')
  @FileUploadSingle('file')
  @HttpCode(HttpStatus.OK)
  @UserProtected()
  @Post('/image')
  async upload(
    @Body()
    body: FileUploadDTO,
    @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
    file: IFile,
  ): Promise<any> {
    const filename: string = file.originalname;

    const content: Buffer = file.buffer;

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase();

    const path = this.uploadService.getPath(body);
    const newFilename = this.uploadService.random(20);

    try {
      const aws: AwsS3Serialization = await this.awsService.putItemInBucket(
        `${newFilename}.${mime}`,
        content,
        'system',
        { path },
      );

      return { data: aws };
    } catch (err: any) {
      throw new HttpException(
        'http.serverError.internalServerError',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UploadImagesDoc()
  @ResponseSingle('user.upload')
  @FileUploadMultiple('files')
  @HttpCode(HttpStatus.OK)
  @UserProtected()
  @Post('/images')
  async uploadImages(
    @Body()
    body: FilesUploadDTO,
    @UploadedFiles(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
    files: IFile[],
  ): Promise<any> {
    const result = [];
    for (let i = 0; i < files.length; i++) {
      const filename: string = files[i].originalname;

      const content: Buffer = files[i].buffer;

      const mime: string = filename
        .substring(filename.lastIndexOf('.') + 1, filename.length)
        .toUpperCase();

      const path = this.uploadService.getPath(body);
      const newFilename = this.uploadService.random(20);

      try {
        const aws: AwsS3Serialization = await this.awsService.putItemInBucket(
          `${newFilename}.${mime}`,
          content,
          'system',
          { path },
        );
        result.push(aws);
      } catch (err: any) {
        throw new HttpException(
          'http.serverError.internalServerError',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return { data: result };
  }
}
