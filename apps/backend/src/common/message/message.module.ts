import { Global, Module } from '@nestjs/common';
import { MessageMiddlewareModule } from 'src/common/message/middleware/message.middleware.module';
import { MessageService } from './services/message.service';

@Global()
@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [MessageMiddlewareModule],
})
export class MessageModule {}
