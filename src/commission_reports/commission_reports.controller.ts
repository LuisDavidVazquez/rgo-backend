import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommissionReportsService } from './commission_reports.service';
import { CreateCommissionReportDto } from './dto/create-commission_report.dto';
import { UpdateCommissionReportDto } from './dto/update-commission_report.dto';
import { CreateReportDto } from 'src/reports/dto/create-report.dto';
import { UpdateReportDto } from 'src/reports/dto/update-report.dto';

@Controller('commission-reports')
export class CommissionReportsController {
  constructor(private readonly commissionReportsService: CommissionReportsService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.commissionReportsService.create(createReportDto);
  }

  @Get('/buscar-por-commission/:idcommission')
  findByCommissionId(@Param('idcommission') idcommission: number) {
    return this.commissionReportsService.findByCommissionId(idcommission);
  }
  @Get()
  findAll() {
    return this.commissionReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commissionReportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.commissionReportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commissionReportsService.remove(+id);
  }
}
