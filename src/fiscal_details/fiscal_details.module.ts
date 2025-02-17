import { Module } from '@nestjs/common';
import { FiscalDetailsService } from './fiscal_details.service';
import { FiscalDetailsController } from './fiscal_details.controller';
import { FiscalDetail } from './entities/fiscal_detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalDetail])],
  controllers: [FiscalDetailsController],
  providers: [FiscalDetailsService],
  exports: [FiscalDetailsService]
})
export class FiscalDetailsModule {}
