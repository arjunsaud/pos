import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsS3Module } from 'src/common/aws/aws.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { UploadService } from './upload.service';

@Module({
  imports: [AwsS3Module, HelperModule, ConfigModule],
  exports: [UploadService],
  providers: [UploadService],
  controllers: [],
})
export class UploadModule { }
