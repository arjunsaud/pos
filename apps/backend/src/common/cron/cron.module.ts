import { Module } from '@nestjs/common';
import { AwsS3Module } from '../aws/aws.module';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        AwsS3Module,
        ScheduleModule.forRoot()
    ],
    exports: [CronService],
    providers: [CronService],
})
export class CronModule {

}
