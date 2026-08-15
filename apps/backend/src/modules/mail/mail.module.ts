import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MAIL_JOB } from 'src/common/bull-queue/mail.queue.constant';
import { MailLogRepositoryModule } from '../mail-log/repository/mail-log.repository.module';
import { MailProcessor } from './processors/mail.processor';
import { MailTemplateService } from './services/mail.template.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_JOB,
    }),
    MailLogRepositoryModule,
  ],
  controllers: [],
  providers: [MailProcessor, MailTemplateService],
  exports: [MailProcessor],
})
export class MailModule {}
