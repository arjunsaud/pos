import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { MailQueueModule } from 'src/common/mail-queue/mail.queue.module';
import { AdminRepositoryModule } from 'src/modules/admin/repository/admin.repository.module';
import { VerificationModule } from '../verification/verification.module';
import { AdminService } from './services/admin.service';

@Module({
  imports: [
    AdminRepositoryModule,
    VerificationModule,
    AuthModule.forRoot(),
    MailQueueModule,
  ],
  exports: [AdminService],
  providers: [AdminService],
})
export class AdminModule { }
