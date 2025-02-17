import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from 'src/reports/dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionReport } from './entities/commission_report.entity';
import { Commission } from 'src/commissions/entities/commission.entity';
import { UpdateReportDto } from 'src/reports/dto/update-report.dto';
import { Reportcomisione } from 'src/reports/entities/report.entity';
@Injectable()
export class CommissionReportsService {
  constructor(
    @InjectRepository(CommissionReport)
    private reportsRepository: Repository<CommissionReport>, // Asegúrate de que esto esté declarado
  ) {}

  async create(createReportDto: CreateReportDto): Promise<CommissionReport> {
    const report = this.reportsRepository.create(createReportDto);
    return await this.reportsRepository.save(report);
  }

  async findByCommissionId(idcommission: number): Promise<CommissionReport[]> {
    return await this.reportsRepository.find({ where: { commission: { commission: idcommission } } });
  }

  async findAll(): Promise<CommissionReport[]> {
    return await this.reportsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
