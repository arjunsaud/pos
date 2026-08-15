import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from 'src/common/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { AdminModule } from 'src/modules/admin/admin.module';
import { SettingsModule } from 'src/modules/settings/settings.module';
import { MigrateDefaultAdmin } from './seeds/admin.seed';

@Module({
  imports: [
    AdminModule,
    AuthModule.forRoot(),
    CommonModule,
    CommandModule,
    SettingsModule,
  ],
  providers: [MigrateDefaultAdmin],
})
export class AdminMigrationModule {}
