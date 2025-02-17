import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSimInventoryDto } from './dto/create-sim_inventory.dto';
import { UpdateSimInventoryDto } from './dto/update-sim_inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SimInventory } from './entities/sim_inventory.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Sim } from 'src/sims/entities/sim.entity';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class SimInventoriesService {
  constructor(
    @InjectRepository(SimInventory)
    private simInventoryRepository: Repository<SimInventory>,
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(
    createSimInventoryDto: CreateSimInventoryDto,
  ): Promise<SimInventory> {
    const newSimInventario = this.simInventoryRepository.create(
      createSimInventoryDto,
    );
    return this.simInventoryRepository.save(newSimInventario);
  }

  async assignClient(id: number, clientId: number): Promise<{ sim: Sim, message: string }> {
    const simInventario = await this.simInventoryRepository.findOne({
      where: { id },
    });
    if (!simInventario) {
      throw new NotFoundException(
        `SIM con ID ${id} no encontrada en inventario`,
      );
    }
    const newSim = this.simRepository.create({
      id: simInventario.id,
      companyClient: simInventario.companyClient,
      statusId: simInventario.statusId,
      status: 'inventario',
      name: simInventario.name,
      days: simInventario.days,
      paidDate: simInventario.paidDate,
      dueDate: simInventario.dueDate,
      rechargePlanId: simInventario.rechargePlanId,
      planName: simInventario.planName,
      iccid: simInventario.iccid,
      imsi: simInventario.imsi,
      msisdn: simInventario.msisdn,
      activationDate: simInventario.activationDate,
      lastStatusUpdate: simInventario.lastStatusUpdate,
      createdAt: simInventario.createdAt,
      updatedAt: new Date(),
      client: await this.clientsRepository.findOne({ where: { id: clientId } }),
      isFirstPost: simInventario.isFirstPost,
    });

    await this.simInventoryRepository.remove(simInventario);

    const savedSim = await this.simRepository.save(newSim);
    
    return {
      sim: savedSim,
      message: 'SIM asignada exitosamente al cliente'
    };
  }

  async findAll(): Promise<SimInventory[]> {
    return this.simInventoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} simInventory`;
  }

  update(id: number, updateSimInventoryDto: UpdateSimInventoryDto) {
    return `This action updates a #${id} simInventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} simInventory`;
  }

  async asignarSimACliente(iccid: string, clientName: string): Promise<{ sim: Sim, message: string }> {
    const simInventario = await this.simInventoryRepository.findOne({
      where: { iccid },
    });
    if (!simInventario) {
      throw new NotFoundException(
        `SIM con ICCID ${iccid} no encontrada en inventario`,
      );
    }

    const client = await this.clientsRepository.findOne({
      where: { name: clientName },
    });
    if (!client) {
      throw new NotFoundException(
        `Cliente con nombre ${clientName} no encontrado`,
      );
    }

    const newSim = this.simRepository.create({
      id: simInventario.id,
      iccid: simInventario.iccid,
      clientName: clientName,
      companyClient: simInventario.companyClient,
      statusId: simInventario.statusId,
      status: 'Asignado',
      msisdn: simInventario.msisdn,
      createdAt: simInventario.createdAt,
      updatedAt: new Date(),
      isFirstPost: simInventario.isFirstPost,
      clientId: client.id,
    });

    await this.simInventoryRepository.remove(simInventario);
    const savedSim = await this.simRepository.save(newSim);

    return {
      sim: savedSim,
      message: `SIM con ICCID ${iccid} asignada exitosamente al cliente ${clientName}`
    };
  }

  async findAllSims() {
    try {
      const sims = await this.simInventoryRepository.find({
        select: {
          id: true,
          iccid: true,
          msisdn: true,
          status: true,
          client: true,
          name: true,
          activationDate: true,
          lastStatusUpdate: true,
          createdAt: true,
          updatedAt: true,
          companyClient: true,
          statusId: true,
          days: true,
          planName: true
        },
        order: {
          createdAt: 'DESC'
        }
      });

      const totalSims = await this.simInventoryRepository.count();

      return {
        success: true,
        message: `Se encontraron ${sims.length} SIMs en inventario`,
        total: totalSims,
        data: sims,
        metadata: {
          activas: sims.filter(sim => sim.status === 'activa').length,
          inactivas: sims.filter(sim => sim.status === 'inactiva').length,
          enInventario: sims.filter(sim => sim.status === 'inventario').length,
          porCompanyClient: this.agruparPorCompanyClient(sims)
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las SIMs del inventario: ' + error.message);
    }
  }

  private agruparPorCompanyClient(sims: SimInventory[]) {
    return sims.reduce((acc, sim) => {
      acc[sim.companyClient] = (acc[sim.companyClient] || 0) + 1;
      return acc;
    }, {});
  }
}