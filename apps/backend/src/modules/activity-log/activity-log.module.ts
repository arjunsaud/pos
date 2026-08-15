import { Module } from '@nestjs/common';
import { ActivityLogRepositoryModule } from './repository/activity-log.repository.module';
import { ActivityLogService } from './services/activity-log.service';

@Module({
  imports: [ActivityLogRepositoryModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
