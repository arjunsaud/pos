import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { UserRepositoryModule } from 'src/modules/user/repository/user.repository.module';
import { MailLogModule } from '../mail-log/mail-log.module';
import { VerificationModule } from '../verification/verification.module';
import { UserService } from './services/user.service';
import { MailQueueModule } from 'src/common/mail-queue/mail.queue.module';

@Module({
  imports: [
    UserRepositoryModule,
    VerificationModule,
    AuthModule.forRoot(),
    MailLogModule,
    MailQueueModule,
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
