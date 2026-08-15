import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from 'src/common/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { TenantModule } from 'src/modules/tenant/tenant.module';
import { UserModule } from 'src/modules/user/user.module';
import { MigrateDefaultTenantAdmin } from './seeds/user.seed';

@Module({
  imports: [
    UserModule,
    TenantModule,
    AuthModule.forRoot(),
    CommonModule,
    CommandModule,
  ],
  providers: [MigrateDefaultTenantAdmin],
})
export class UserMigrationModule {}
