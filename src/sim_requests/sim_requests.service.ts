import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSimRequestDto } from './dto/create-sim_request.dto';
import { UpdateSimRequestDto } from './dto/update-sim_request.dto';
import { SimRequest } from './entities/sim_request.entity';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class SimRequestsService {
  constructor(
    @InjectRepository(SimRequest)
    private simRequestRepository: Repository<SimRequest>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createSimRequestDto: CreateSimRequestDto) {
    const client = await this.clientRepository.findOne({ where: { id: createSimRequestDto.clientId } });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const nuevaSolicitud = this.simRequestRepository.create({
      ...createSimRequestDto,
      client,
    });

    return this.simRequestRepository.save(nuevaSolicitud);
  }

  async findAll(): Promise<SimRequest[]> {
    return this.simRequestRepository.find({
      relations: ['client']
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} simRequest`;
  }

  update(id: number, updateSimRequestDto: UpdateSimRequestDto) {
    return `This action updates a #${id} simRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} simRequest`;
  }
}
