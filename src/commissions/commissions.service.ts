import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from './entities/commission.entity';

@Injectable()
export class CommissionsService {

  constructor(@InjectRepository(Commission)
  private repo: Repository<Commission>) { }

  async create(createCommissionDto: CreateCommissionDto) {
    const comisione = this.repo.create(createCommissionDto);
    return this.repo.save(comisione);
  }

  //Localiza el método findOne y actualiza el retorno para que tenga este aspecto:
  findOne(id: number) {
    return this.repo.findOneBy({ id });


    //return this.repo.findOne(id);
    //return `This action returns a #${id} comisione`;
  }

  //Localiza el método find y actualiza el retorno para que tenga este aspecto:
  find(commission: Commission) {
    return this.repo.find({ where: { commission: commission.commission } });
    //return this.repo.find({ comision });
  }

  async update(id: number, attrs: Partial<Commission>) {
    const comision = await this.findOne(id);
    if (!comision) {
      throw new NotFoundException('No se ha encontrado la comisión');
    }
    Object.assign(comision, attrs);//concatenamos los atributos del objeto existente con los nuevos val
    return this.repo.save(comision);
  }

  //update(id: number, updateComisioneDto: UpdateComisioneDto) {
  // return `This action updates a #${id} comisione`;
  // }

  async remove(id: number) {
    const comision = await this.findOne(id);
    if (!comision) {
      throw new NotFoundException("No se ha encontrado la comisión");
      //return `This action removes a #${id} comisione`;
    }
    return this.repo.remove(comision)
  }
}
