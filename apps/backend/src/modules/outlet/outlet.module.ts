import { Module } from '@nestjs/common';
import { OutletRepositoryModule } from './repository/outlet.repository.module';
import { OutletService } from './services/outlet.service';

@Module({
  imports: [OutletRepositoryModule],
  providers: [OutletService],
  exports: [OutletService],
})
export class OutletModule {}
