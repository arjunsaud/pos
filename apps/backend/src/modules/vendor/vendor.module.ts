import { Module } from '@nestjs/common';
import { VendorRepositoryModule } from './repository/vendor.repository.module';
import { VendorService } from './services/vendor.service';

@Module({
  imports: [VendorRepositoryModule],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
