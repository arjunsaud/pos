import { Module } from '@nestjs/common';
import { SettingsRepositoryModule } from './repository/settings.repository.module';
import { SettingsService } from './services/settings.service';

@Module({
  imports: [SettingsRepositoryModule],
  controllers: [],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
