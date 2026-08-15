import { Module } from '@nestjs/common';
import { TemplateRepositoryModule } from './repository/template.repository.module';
import { TemplateService } from './services/template.service';

@Module({
  imports: [TemplateRepositoryModule],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
