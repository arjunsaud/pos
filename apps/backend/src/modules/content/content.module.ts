import { Module } from '@nestjs/common';
import { ContentRepositoryModule } from './repository/content.repository.module';
import { ContentService } from './services/content.service';

@Module({
  imports: [ContentRepositoryModule],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
