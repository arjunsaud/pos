import { Module } from '@nestjs/common';
import { PackageRepositoryModule } from './repository/package.repository.module';
import { PackageService } from './services/package.service';

@Module({
  imports: [PackageRepositoryModule],
  providers: [PackageService],
  exports: [PackageService],
})
export class PackageModule {}
