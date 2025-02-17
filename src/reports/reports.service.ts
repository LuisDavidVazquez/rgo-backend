import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Reportcomisione } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {

  constructor(
    @InjectRepository(Reportcomisione)
    private reportsRepository: Repository<Reportcomisione>, // Asegúrate de que esto esté declarado
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Reportcomisione> {
    const report = this.reportsRepository.create(createReportDto);
    return await this.reportsRepository.save(report);
  }

  async findByComisioneId(idcomisione: number): Promise<Reportcomisione[]> {
    return await this.reportsRepository.find({ where: { idcomisione } });
  }

  async findAll(): Promise<Reportcomisione[]> {
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
