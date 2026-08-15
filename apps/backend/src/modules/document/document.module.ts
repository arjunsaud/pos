import { Module } from '@nestjs/common';
import { DocumentRepositoryModule } from './repository/document.repository.module';
import { DocumentService } from './services/document.service';

@Module({
  imports: [DocumentRepositoryModule],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
