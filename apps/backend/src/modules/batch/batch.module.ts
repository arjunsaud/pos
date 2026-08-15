import { Module } from '@nestjs/common';
import { BatchRepositoryModule } from './repository/batch.repository.module';
import { BatchService } from './services/batch.service';

@Module({
  imports: [BatchRepositoryModule],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
