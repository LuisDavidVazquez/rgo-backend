import { Injectable } from '@nestjs/common';
import { CreateSimClientIccidDto } from './dto/create-sim_client_iccid.dto';
import { UpdateSimClientIccidDto } from './dto/update-sim_client_iccid.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SimClientIccid } from './entities/sim_client_iccid.entity';
import { Sim } from 'src/sims/entities/sim.entity';
import { ClientIccid } from 'src/client_iccids/entities/client_iccid.entity';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class SimClientIccidsService {

  constructor(
    @InjectRepository(SimClientIccid)
    private simClientIccidRepository: Repository<SimClientIccid>,
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
    @InjectRepository(ClientIccid)
    private clientIccidRepository: Repository<ClientIccid>,
  ) {}

  async create(createSimClientIccidDto: CreateSimClientIccidDto) {
      return this.simClientIccidRepository.manager.transaction(async transactionalEntityManager => {
        const [sim, clienticcids] = await Promise.all([
          transactionalEntityManager.findOne(Sim, { 
            where: { id: createSimClientIccidDto.simId },
            select: ['id']
          }),
          transactionalEntityManager.findOne(ClientIccid, { 
            where: { id: createSimClientIccidDto.clientIccidId },
            select: ['id']
          })
        ]);
  
        if (!sim) {
          throw new NotFoundException(`Sim con ID ${createSimClientIccidDto.simId} no encontrada`);
        }
        if (!clienticcids) {
          throw new NotFoundException(`ClienteIccid con ID ${createSimClientIccidDto.clientIccidId} no encontrado`);
        }
  
        const simClientIccid = transactionalEntityManager.create(SimClientIccid, {
          simId: sim.id,
          clientIccidId: clienticcids.id
        });
  
        return transactionalEntityManager.save(SimClientIccid, simClientIccid);
      });
    }
  
    findAll() {
      return `This action returns all simClientIccid`;
    }
  
    findOne(id: number) {
      return `This action returns a #${id} simClientIccid`;
    }
  
    update(id: number, updateSimClientIccidDto: UpdateSimClientIccidDto) {
        return `This action updates a #${id} simClientIccid`;
    }
  
    remove(id: number) {
      return `This action removes a #${id} simClientIccid`;
    }
  }