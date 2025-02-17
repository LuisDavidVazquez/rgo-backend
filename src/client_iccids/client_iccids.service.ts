import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientIccidDto } from './dto/create-client_iccid.dto';
import { UpdateClientIccidDto } from './dto/update-client_iccid.dto';
import { ClientIccid } from './entities/client_iccid.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { SimsService } from 'src/sims/sims.service';
import { Sim } from 'src/sims/entities/sim.entity';
import { SimClientIccid } from 'src/sim_client_iccids/entities/sim_client_iccid.entity';

@Injectable()
export class ClientIccidsService {
  constructor(
    @InjectRepository(ClientIccid)
    private clientIccidRepository: Repository<ClientIccid>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Sim)
    private simRepository: Repository<Sim>,
    private simsService: SimsService,
    @InjectRepository(Client)
    private clientesRastreoGoRepository: Repository<Client>,
    @InjectRepository(SimClientIccid)
    private simClientIccidRepository: Repository<SimClientIccid>,
  ) { }

  async create(createClientIccidDto: CreateClientIccidDto): Promise<ClientIccid> {
    //console.log('createClientIccidDto', createClientIccidDto);
    return this.clientIccidRepository.manager.transaction(async transactionalEntityManager => {
      try {
        if (!createClientIccidDto.username) {
           console.log('Error: username requerido');
          throw new BadRequestException('Se requiere un username');
        }

        const tempUser = new User();
        const usernameHash = tempUser.hashField(createClientIccidDto.username);

        const user = await this.userRepository.findOne({
          where: { username_hash: usernameHash }
        });

        if (!user) {
           console.log('Error: usuario no encontrado');
          throw new NotFoundException(`No se encontró un usuario con el username ${createClientIccidDto.username}`);
        }

        let sim = await this.simRepository.findOne({
          where: { iccid: createClientIccidDto.iccid }
        });

        if (!sim) {
          await this.simsService.syncSims();
          sim = await this.simRepository.findOne({
            where: { iccid: createClientIccidDto.iccid }
          });

          if (!sim) {
            throw new NotFoundException(`No SIM found with ICCID ${createClientIccidDto.iccid} after synchronization`);
          }
        }

        const newClientIccid = this.clientIccidRepository.create({
          iccid: createClientIccidDto.iccid,
          unitName: createClientIccidDto.unitName,
          imei: createClientIccidDto.imei,
          gps: createClientIccidDto.gps,
          userId: user.id,
          isActive: createClientIccidDto.isActive,
          simId: createClientIccidDto.simId,
          clientId: createClientIccidDto.clientId,
        });

        const savedClientIccid = await transactionalEntityManager.save(ClientIccid, newClientIccid);
        const updatesim = await this.simsService.update(createClientIccidDto.simId, {
          name: createClientIccidDto.unitName,
        });


        if (createClientIccidDto.simId) {
          const simClientIccid = transactionalEntityManager.create(SimClientIccid, {
            simId: createClientIccidDto.simId,
            clientIccidId: savedClientIccid.id,
          });

          await transactionalEntityManager.save(SimClientIccid, simClientIccid);
        }

        return savedClientIccid;
      } catch (error) {
         console.log('Error en create:', error);
        throw error;
      }
    });
  }

  async limpiarCampos(id: number): Promise<ClientIccid> {
    const clientIccid = await this.clientIccidRepository.findOneBy({ id });
    if (!clientIccid) {
      throw new NotFoundException(`ClienteIccid con ID ${id} no encontrado.`);
    }

    clientIccid.unitName = '';
    clientIccid.imei = '';
    clientIccid.gps = '';
    clientIccid.simId = null;
    clientIccid.clientId = null;

    return await this.clientIccidRepository.save(clientIccid);
  }

  findAll(): Promise<ClientIccid[]> {
    return this.clientIccidRepository.find({ relations: ['user', 'sims'] });
  }

  async findOne(id: number): Promise<ClientIccid> {
    try {
      const clientIccid = await this.clientIccidRepository.findOneBy({ id });
      if (!clientIccid) {
        throw new NotFoundException(`ClientIccid with ID ${id} not found`);
      }
      return clientIccid;
    } catch (error) {
      // console.log(error, 'estos son los errores');
    }
  }

  async findByUserId(userId: number): Promise<ClientIccid[]> {
    try {
      const clientIccids = await this.clientIccidRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'sims'],
      });

      if (!clientIccids.length) {
        throw new NotFoundException(`No ClientIccid found for User ID ${userId}`);
      }

      return clientIccids;
    } catch (error) {
      // console.log(error, 'estos son los errores');
    }
  }

  // update(id: number, updateClientIccidDto: UpdateClientIccidDto) {
  //return `This action updates a #${id} clientIccid`;
  //}

  async remove(id: number): Promise<void> {
    const result = await this.clientIccidRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ClientIccid con ID ${id} no encontrado.`);
    }
  }


  async getUserWithSimStatus(clientId: number): Promise<any[]> {
    // console.log('Iniciando el proceso de getUserWithSimStatus RUTA CLIENT_ICCIDS.SERVICE para clientId:', clientId);
    try {
      // Primero obtenemos los usuarios asociados al clientId
      const users = await this.clientIccidRepository
        .createQueryBuilder('clientIccid')
        .leftJoinAndSelect('clientIccid.user', 'user')
        .leftJoinAndSelect('clientIccid.simClientIccids', 'simClientIccids')
        .leftJoinAndSelect('simClientIccids.sim', 'sim')
        .where('clientIccid.clientId = :clientId', { clientId })
        .getMany();

      // console.log('Usuarios encontrados:', users);

      if (!users || users.length === 0) {
        console.warn(`No se encontraron registros para clientId: ${clientId}`);
        return [];
      }

      // Agrupamos los resultados por usuario
      const userMap = new Map();

      users.forEach(clientIccid => {
        const userId = clientIccid.userId;

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId: userId,
            username: clientIccid.user ? clientIccid.user.username : 'Desconocido',
            sims: [],
            totalSims: 0,
            activeSims: 0,
            expiredSims: 0
          });
        }

        const userInfo = userMap.get(userId);

        // Procesamos la información de los SIMs
        if (clientIccid.simClientIccids && clientIccid.simClientIccids.length > 0) {
          clientIccid.simClientIccids.forEach(simClientIccid => {
            if (simClientIccid.sim) {
              userInfo.sims.push({
                id: simClientIccid.sim.id,
                status: simClientIccid.sim.status,
                name: simClientIccid.sim.name,
                dueDate: simClientIccid.sim.dueDate,
                planName: simClientIccid.sim.planName,
                iccid: clientIccid.iccid,
                gps: clientIccid.gps,
                imei: clientIccid.imei
              });

              userInfo.totalSims++;
              if (simClientIccid.sim.status.toLowerCase() === 'activo') {
                userInfo.activeSims++;
              } else if (simClientIccid.sim.status.toLowerCase() === 'suspendido') {
                userInfo.expiredSims++;
              }
            }
          });
        }
      });

      const result = Array.from(userMap.values());
      // console.log('Resultado final procesado:', result);
      return result;

    } catch (error) {
      console.error('Error en getUserWithSimStatus:', error);
      throw error;
    }
  }

  async findBySimId(simId: number): Promise<ClientIccid[]> {
    try {
      const clientIccids = await this.clientIccidRepository.find({
        where: {
          simId: simId
        },
        relations: ['user', 'sims']
      });

      if (!clientIccids || clientIccids.length === 0) {
        throw new NotFoundException(`No se encontraron registros para el simId ${simId}`);
      }

      return clientIccids;

    } catch (error) {
      console.error('Error al buscar por simId:', error);
      throw error;
    }
  }

  async update(id: number, updateClientIccidDto: UpdateClientIccidDto): Promise<ClientIccid> {
    const clientIccid = await this.clientIccidRepository.findOne({ where: { id } });
    if (!clientIccid) {
      throw new NotFoundException(`ClientIccid con ID ${id} no encontrado.`);
    }

    return this.clientIccidRepository.save(clientIccid);
  }


  async updateByIccid(iccid: string, updateClientIccidDto: UpdateClientIccidDto): Promise<ClientIccid> {
    const clientIccid = await this.clientIccidRepository.findOne({ where: { iccid } });
    if (!clientIccid) {
      throw new NotFoundException(`ClientIccid con ICCID ${iccid} no encontrado.`);
    }

    // Actualizar el campo imei si está presente en el DTO
    if (updateClientIccidDto.imei !== undefined) {
      clientIccid.imei = updateClientIccidDto.imei;
    }

    // Puedes actualizar otros campos de manera similar
    // ...

    return this.clientIccidRepository.save(clientIccid);
  }

}
