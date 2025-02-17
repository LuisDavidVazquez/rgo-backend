import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reportcomisione } from './entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reportcomisione]),ReportsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
