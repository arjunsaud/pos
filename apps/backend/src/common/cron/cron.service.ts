import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '../aws/services/aws.s3.service';

const execAsync = promisify(exec);

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly backupDir = path.join('./backup');
  private readonly mongoUri: string;
  private readonly bucket: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly awsService: AwsS3Service,
  ) {
    this.bucket = this.configService.get<string>('aws.bucket');
    this.mongoUri =
      this.configService.get<string>('database.host') +
      '/' +
      this.configService.get<string>('database.name');
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir);
    }
  }

  // Run every day at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleBackup() {
    const filename = 'ien-database.gz';
    const backupFile = path.join(this.backupDir, filename);
    try {
      this.logger.log('Starting MongoDB backup...');
      // Run mongodump
      await execAsync(
        `mongodump --uri="${this.mongoUri}" --archive=${filename} --gzip`,
      );

      this.logger.log(`Backup created`);

      await this.awsService.putItemInBucket(
        filename,
        fs.createReadStream(backupFile),
        'system',
        {
          path: 'backup',
        },
      );
      this.logger.log(`Backup uploaded`);
      fs.unlinkSync(backupFile);
    } catch (error) {
      this.logger.error('Backup failed', error);
    }
  }

  async uploadFile() {}
}
