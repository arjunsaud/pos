import { Module } from '@nestjs/common';
import { MailLogRepositoryModule } from './repository/mail-log.repository.module';
import { MailLogService } from './services/mail-log.service';

@Module({
  imports: [MailLogRepositoryModule],
  controllers: [],
  providers: [MailLogService],
  exports: [MailLogService],
})
export class MailLogModule {}
