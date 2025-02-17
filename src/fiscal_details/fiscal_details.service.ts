import { Injectable } from '@nestjs/common';
import { CreateFiscalDetailDto } from './dto/create-fiscal_detail.dto';
import { UpdateFiscalDetailDto } from './dto/update-fiscal_detail.dto';
import { FiscalDetail } from './entities/fiscal_detail.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FiscalDetailsService {
  constructor(
    @InjectRepository(FiscalDetail)
    private fiscalDetailRepository: Repository<FiscalDetail>,
  ) { }
 
  async create(createFiscalDetailDto: CreateFiscalDetailDto): Promise<FiscalDetail> {
    const newFiscalDetail = this.fiscalDetailRepository.create(createFiscalDetailDto);
    return this.fiscalDetailRepository.save(newFiscalDetail);
  }

  findAll() {
    return this.fiscalDetailRepository.find(); // Return all fiscal data
  }

  findOne(id: number) {
    return this.fiscalDetailRepository.findOneBy({ id }); // Find a single fiscal data by ID
  }

  async update(id: number, updateFiscalDetailDto: UpdateFiscalDetailDto): Promise<FiscalDetail> {
    await this.fiscalDetailRepository.update(id, updateFiscalDetailDto);
    return this.fiscalDetailRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    try {
      const deleteResult = await this.fiscalDetailRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new Error(`FiscalDetail with ID ${id} not found`);
      }
    } catch (error) {
      // Handle or log the error as necessary
      throw new Error(`Failed to remove FiscalDetail with ID ${id}: ${error.message}`);
    }
  }

  findByClient(id: number) {
    try {
      return this.fiscalDetailRepository.findOneBy({ clientId: id });
    } catch (error) {
      console.error('Error al obtener los datos fiscales por cliente:', error);
      throw new Error('No se pudo obtener los datos fiscales por cliente');
    }
  }
}
