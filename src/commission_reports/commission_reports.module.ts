import { Module } from '@nestjs/common';
import { CommissionReportsService } from './commission_reports.service';
import { CommissionReportsController } from './commission_reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionReport } from './entities/commission_report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionReport]), CommissionReportsModule],
  controllers: [CommissionReportsController],
  providers: [CommissionReportsService],
  exports: [TypeOrmModule], // Exportar para que otros módulos puedan usarlo
})
export class CommissionReportsModule {}
