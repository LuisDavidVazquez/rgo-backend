import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Sim } from './entities/sim.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TokensService } from 'src/tokens/tokens.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { config } from '../config';
import { NotificationsService } from 'src/notifications/notifications.service';
import { FiscalDetail } from 'src/fiscal_details/entities/fiscal_detail.entity';
import { SimInventoriesService } from 'src/sim_inventories/sim_inventories.service';
import { EntityManager } from 'typeorm';
import { SimInventory } from 'src/sim_inventories/entities/sim_inventory.entity';
import { CreateSimInventoryDto } from 'src/sim_inventories/dto/create-sim_inventory.dto';
import { RechargePlanMovement } from 'src/recharge_plan_movements/entities/recharge_plan_movement.entity';
import { RechargePlanMovementsService } from 'src/recharge_plan_movements/recharge_plan_movements.service';

@Injectable()
export class SimsService {
  private simCache: Map<string, Sim> = new Map(); // Caché para almacenar SIMs recién actualizadas

  constructor(
    @InjectRepository(Sim)
    private readonly simRepository: Repository<Sim>,
    private httpService: HttpService,
    private tokensService: TokensService,
    private simsInventariosService: SimInventoriesService,
    private rechargePlanMovementsService: RechargePlanMovementsService,
    private notificationsService: NotificationsService // Asegúrate de que esta línea esté presente
  ) { }

  async create(createSimDto: CreateSimDto): Promise<Sim> {
    const sim = new Sim();
    Object.assign(sim, createSimDto);

    return await this.simRepository.save(sim);
  }

  async syncSims(): Promise<{ message: string }> {
    const simsCreados: string[] = [];
    let totalPages = 0;
    let totalSims = 0;
    let simsGuardados = 0;

    try {
      const { sims: externalSims, totalPages: fetchedTotalPages } = await this.fetchSims();
      totalPages = fetchedTotalPages;
      totalSims = externalSims.length;

      for (const externalSim of externalSims) {
        if (externalSim.id == null) {
          console.error(`SIM con ICCID ${externalSim.iccid} no tiene ID válido. Saltando...`);
          continue;
        }

        let sim = await this.simRepository.findOne({ where: { iccid: externalSim.iccid } });

        if (!sim) {
          sim = this.simRepository.create({
            id: externalSim.id,
            iccid: externalSim.iccid,
            msisdn: externalSim.msisdn,
            statusId: externalSim.status.id,
            status: externalSim.status.name,
            clientName: externalSim.companyClient.name,
            companyClient: externalSim.companyClient.id,
            planName: externalSim.planName,
            imsi: externalSim.imsi,
            activationDate: externalSim.activationDate ? new Date(externalSim.activationDate) : null,
            lastStatusUpdate: externalSim.lastStatusUpdate ? new Date(externalSim.lastStatusUpdate) : null,
            name: externalSim.line.length > 0 ? externalSim.line[0].lineName : null,
            clientId: null,
          });
          simsCreados.push(externalSim.id);
        } else {
          Object.assign(sim, {
            iccid: externalSim.iccid,
            msisdn: externalSim.msisdn,
            statusId: externalSim.status.id,
            status: externalSim.status.name,
            clientName: externalSim.companyClient.name,
            companyClient: externalSim.companyClient.id,
            planName: externalSim.planName,
            imsi: externalSim.imsi,
            activationDate: externalSim.activationDate ? new Date(externalSim.activationDate) : null,
            lastStatusUpdate: externalSim.lastStatusUpdate ? new Date(externalSim.lastStatusUpdate) : null,
            name: externalSim.line.length > 0 ? externalSim.line[0].lineName : null,
          });
        }

        try {
          const savedSim = await this.simRepository.save(sim);
          simsGuardados++;
        } catch (error) {
          console.error(`Error al sincronizar SIM con ID ${externalSim.id}:`, error);
          if (error.detail) {
            console.error('Detalle del error:', error.detail);
          }
          throw error;
        }
      }

      return {
        message: `Sincronización completada. Total de SIMs: ${totalSims}, SIMs guardados: ${simsGuardados}, SIMs nuevos: ${simsCreados.length}`
      };

    } catch (error) {
      console.error('Error en syncSims:', error);
      throw error;
    }
  }




  private async fetchSims(): Promise<{ sims: any[], totalPages: number, totalSims: number }> {
    // console.log('Iniciando fetchSims...');
    const token = await this.tokensService.obtenerUltimoToken();
    if (!token) {
      console.error("No se pudo obtener el token para la autenticación.");
      throw new Error("No se pudo obtener el token para la autenticación.");
    }

    const baseUrl = config.apiBaseUrl;
    if (!baseUrl) {
      throw new Error('API_BASE_URL no está definida');
    }

    const apiUrl = `${baseUrl}/sims`;
    const headersRequest = {
      headers: { Authorization: `Bearer ${token.token}` },
    };

    let allSims: any[] = [];
    let currentPage = 1;
    let totalPages = 1; // Inicialmente asumimos que hay al menos una página
    let totalSims = 0;

    try {
      // console.log('Comenzando a obtener SIMs con paginación...');
      do {
        try {
          // console.log(`Haciendo solicitud a: ${apiUrl}?page=${currentPage}`);
          const response = await firstValueFrom(this.httpService.get(`${apiUrl}?page=${currentPage}`, headersRequest));

          const sims = response.data.sims;
          if (Array.isArray(sims)) {
            allSims = allSims.concat(sims);
            totalSims += sims.length;
            // console.log(`Página ${currentPage} obtenida. SIMs en esta página: ${sims.length}`);
          } else {
            console.error('Datos inválidos recibidos de la API:', typeof sims);
            break;
          }

          totalPages = response.data.pages || 1;
        } catch (paginaError) {
          console.error(`Error al obtener la página ${currentPage}:`, paginaError);
          // Opcional: Decidir si continuar con la siguiente página o detenerse
        }
        currentPage++;
      } while (currentPage <= totalPages);

      // console.log(`Total de páginas obtenidas: ${totalPages}`);
      // console.log(`Total de SIMs obtenidos: ${allSims.length}`);

      return { 
        sims: allSims, 
        totalPages,
        totalSims
      };
    } catch (error) {
      console.error('Error fetching SIMs from external API:', error);
      if (error.response) {
        console.error('Respuesta de error:', error.response.data);
      }
      throw new Error('Failed to fetch SIMs');
    }
  }


  async clearSimFields(id: string): Promise<Sim> {
    // console.log('Iniciando clearSimFields...');

    try {
      // Buscar la SIM directamente usando findOneBy
      const sim = await this.simRepository.findOneBy({
        id: parseInt(id)
      });

      if (!sim) {
        throw new NotFoundException(`SIM con ID ${id} no encontrada`);
      }

      // Actualizar los campos
      const updatedFields = {
        status: 'Inactivo',
        clientId: null,
        clientName: 'RastreoGo',
        name: null,
        days: 0,
        paidDate: null,
        dueDate: null,
        rechargePlanId: null,
        planName: null,
        activationDate: null,
        lastStatusUpdate: new Date(),
        isFirstPost: false,
        statusId: 1 // Asumiendo que 1 es el ID para estado "Inventario"
      };

      // Actualizar la entidad
      await this.simRepository.update(sim.id, updatedFields);

      // Obtener la SIM actualizada
      const updatedSim = await this.simRepository.findOneBy({ id: sim.id });

      if (!updatedSim) {
        throw new NotFoundException(`No se pudo encontrar la SIM actualizada`);
      }

      return updatedSim;

    } catch (error) {
      console.error('Error en clearSimFields:', error);
      throw new BadRequestException('Error al limpiar campos de la SIM');
    }
  }

  async changeSimStatus(id: number, newStatus: string): Promise<Sim> {
    const sim = await this.simRepository.findOneBy({ id });
    if (!sim) {
      throw new NotFoundException(`Sim with ID ${id} not found`);
    }

    sim.status = newStatus;
    await this.simRepository.save(sim);
    return sim;
  }


  //   1 Inventario - La SIM esta nueva, nunca se ha usado por lo tanto se requiere activar el servicio por primera vez
  // 2. Activa - La SIM tiene un servicio existente y esta activo. 
  // 3 Suspendida. La SIM tiene un servicio existente y esta suspendida.
  // 4. Eliminado. El servicio de la SIM se activo anteriormente pero fue eliminado, para poder activarla es necesario
  //  volver a crear un servicio como si fuera por primera vez
  async handleSim(simDto: CreateSimDto): Promise<Sim & { message: string }> {
    return this.simRepository.manager.transaction(async transactionalEntityManager => {
      // console.log('Datos recibidos en handleSim:', JSON.stringify(simDto, null, 2));

      let sim: Sim;

      // Intentar obtener la SIM del caché o la base de datos
      if (this.simCache.has(simDto.iccid)) {
        sim = this.simCache.get(simDto.iccid);
        // console.log('SIM obtenida del caché:', JSON.stringify(sim, null, 2));
      } else {
        sim = await transactionalEntityManager.findOne(Sim, {
          where: { iccid: simDto.iccid },
          lock: { mode: 'pessimistic_write' }
        });
        // console.log('SIM obtenida de la base de datos:', JSON.stringify(sim, null, 2));
      }

      const currentDate = new Date();

      // Verificar si es la primera recarga
      const isFirstRecharge = !sim || sim.isFirstPost === false;

      if (!sim) {
        // El error ocurre porque el campo 'client' en el simDto es de tipo string,
        // pero la entidad Sim espera que 'client' sea un objeto de tipo Client.
        // Necesitamos crear un objeto Client válido o remover el campo client del simDto

        const { client, ...restSimDto } = simDto; // Removemos el campo client del simDto

        sim = transactionalEntityManager.create(Sim, {
          ...restSimDto,
          days: 0,
          dueDate: null,
          paidDate: null,
          isFirstPost: false,
          clientId: Number(simDto.clientId)
        });
        // console.log('Nueva SIM creada:', JSON.stringify(sim, null, 2));
      }

      const findSim = await this.simRepository.findOneBy({ id: sim.id });
      // console.log('Estado de la SIM antes de la actualización:', JSON.stringify(findSim, null, 2));

      // Calcular la nueva fecha de vencimiento
      let newDueDate: Date;
      if (isFirstRecharge || !findSim.dueDate || findSim.dueDate <= currentDate) {
        // Primera recarga o SIM vencida: usar la fecha actual como base
        newDueDate = this.addDaysToDate(currentDate, simDto.days);
        findSim.paidDate = currentDate;
      } else {
        // Recargas subsiguientes: añadir días a la fecha de vencimiento existente
        newDueDate = this.addDaysToDate(findSim.dueDate, simDto.days);
      }

      // Actualizar campos
      if (isFirstRecharge) {
        // Primera recarga: asignar directamente los días recibidos
        findSim.days = simDto.days;
        // console.log('Primera recarga - Días asignados:', findSim.days);
      } else {
        // Recargas subsiguientes: sumar los días
        findSim.days += simDto.days;
        // console.log('Recarga subsiguiente - Días acumulados:', findSim.days);
      }

      //  const name = simDto.unitName;
      findSim.dueDate = newDueDate;
      findSim.lastStatusUpdate = currentDate;
      if (simDto.rechargePlanId !== undefined) findSim.rechargePlanId = simDto.rechargePlanId;
      if (simDto.planName) findSim.planName = simDto.planName;
      //if (simDto.clientId) findSim.clientId = simDto.clientId;
      if (simDto.unitName) findSim.name = simDto.unitName;
      //if(simDto.clientId) findSim.clientId = simDto.clientId;


      // console.log('Estado de la SIM después de la actualización:', JSON.stringify(findSim, null, 2));

      // Llamar al servicio externo según isFirstPost

      try {
        // console.log('Intentando enviar primer POST al servicio externo...');
        if (!findSim.isFirstPost) {
          if (simDto.clientId) findSim.clientId = (simDto.clientId);
          await this.sendFirstPostToExternalService(findSim);
          // console.log('Primer POST enviado exitosamente:', JSON.stringify(findSim, null, 2));
          //Actualizamos el movement usando el entityManager de la transacción
          await this.rechargePlanMovementsService.updateByActivation(
            findSim.id,
            { isFirstPost: true },
            transactionalEntityManager, // Pasamos el entityManager
          );



        } else {
          await this.updateExternalServiceActive(findSim);
          // console.log('Actualización del servicio externo exitosa:', JSON.stringify(findSim, null, 2));
        }
      } catch (error) {
        console.error('Error al interactuar con el servicio externo:', error);
        //sim.status = 'Error en activación';
        findSim.status = 'Error en activación';
      }

      // console.log('Días acumulados:', findSim.days);
      // console.log('Nueva fecha de vencimiento:', findSim.dueDate);


      try {
        const savedSim = await transactionalEntityManager.save(findSim);
        // console.log('SIM guardada en la base de datos:', JSON.stringify(savedSim, null, 2));

        const verifiedSim = await transactionalEntityManager.findOne(Sim, { where: { id: findSim.id } });
        // console.log('SIM verificada después de guardar:', JSON.stringify(verifiedSim, null, 2));



        if (JSON.stringify(savedSim) !== JSON.stringify(verifiedSim)) {
          console.warn('Advertencia: Los datos guardados y verificados no coinciden exactamente');
        }

        this.simCache.set(findSim.iccid, findSim);
        // console.log('SIM guardada en la base de datos:', JSON.stringify(findSim, null, 2));
        // console.log('SIM verificada después de guardar:', JSON.stringify(verifiedSim, null, 2));

        return {
          ...findSim,
          message: isFirstRecharge ? 'SIM activada exitosamente' : 'SIM recargada exitosamente'
        };
      } catch (error) {
        console.error('Error al guardar la SIM:', error);
        throw error;
      }
    });
  }


  async handleSim2(simDtos: CreateSimDto[]) {
    const results = [];
    for (const simDto of simDtos) {
      try {
        const result = await this.handleSim(simDto);
        results.push(result);
      } catch (error) {
        console.error(`Error procesando SIM: ${error.message}`);
        results.push({
          error: true,
          message: error.message,
          simDto
        });
      }
    }
    return results;
  }


  private addDaysToDate(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }



  // @Cron(CronExpression.EVERY_MINUTE)
  // @Cron("*/ * * * *",)   ///cada minuto


  //Implementamos un cron job (checkAndSuspendExpiredSims) que se 
  // ejecuta cada hora para verificar y suspender las SIMs vencidas.
  @Cron("1 0 * * *") // a las 12  con 1 de la madrugada
  async checkAndSuspendExpiredSims() {
    const startTime = new Date();
    // console.log(`Iniciando cron job a las ${startTime.toLocaleString()}`);

    const allSims = await this.simRepository.find({
      where: {
        status: 'Activo',
      }
    });

    let suspendedCount = 0;
    let notificationCount = 0;

    for (const sim of allSims) {
      if (!sim.dueDate) {
        // console.log(`SIM con ID ${sim.id} no tiene fecha de vencimiento. Saltando...`);
        continue;
      }

      const daysUntilExpiration = sim.dueDate
        ? Math.ceil((sim.dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        : -1; // o cualquier otro valor por defecto que tenga sentido en tu lógica

      if (daysUntilExpiration <= 0) {
        sim.status = 'Suspendido';
        sim.statusId = 3;
        await this.updateExternalServiceSuspend(sim);
        await this.simRepository.save(sim);
        suspendedCount++;
      } else if (daysUntilExpiration <= 7) {
        await this.notificationsService.handleLineExpiration(
          sim.clientId, // Pasar directamente el number
          sim.iccid,
          sim.dueDate
        );
        notificationCount++;
      }
    }

    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;

    // console.log(`Cron job finalizado a las ${endTime.toLocaleString()}`);
    // console.log(`Duración total: ${duration} segundos`);
    // console.log(`SIMs suspendidas: ${suspendedCount}`);
    // console.log(`Notificaciones generadas: ${notificationCount}`);

    return {
      startTime: startTime.toLocaleString(),
      endTime: endTime.toLocaleString(),
      duration: `${duration} segundos`,
      suspendedSims: suspendedCount,
      generatedNotifications: notificationCount
    };
  }

  // Método para enviar el primer POST al servicio externo
  private async sendFirstPostToExternalService(sim: Sim): Promise<Sim> {
    // console.log('Enviando primer POST al servicio externo...');
    const token = await this.tokensService.obtenerUltimoToken();
    if (!token) {
      throw new Error("No se pudo obtener el token para la autenticación.");
    }

    const postData = {
      simId: sim.id,
      serviceId: 514,
      iccid: sim.iccid,
      serviceName: `${sim.clientId},${sim.id}`, // Corregido: combinamos client e id
      coveragePlan: 6,
    };
    // console.log(postData, 'estos son los datos de la sim que se van a enviar al servicio externo');

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${config.apiBaseUrl}/sims`, postData, {
          headers: { Authorization: `Bearer ${token.token}` }
        })
      );
      // console.log('Respuesta del servicio externo (POST):', JSON.stringify(response.data, null, 2));

      // Actualización de los campos de la SIM en memoria
      sim.isFirstPost = true;
      sim.status = 'Activo';
      sim.activationDate = new Date();
      sim.lastStatusUpdate = new Date();
      sim.statusId = 2;


      

      // Actualizar la bandera isFirstPost en RechargePlanMovement
      //// console.log('Actualización de isFirstPost en RechargePlanMovement iniciada' );
    // await this.rechargePlanMovementsService.updateIsFirstPostBySimId(sim.id, true, manager);

      
     // // console.log('Actualización de isFirstPost en RechargePlanMovement completada' );


      return sim;


      // No guardamos aquí, solo actualizamos el objeto en memoria
    } catch (error) {
      console.error('Error al enviar datos al servicio externo (POST):', error.message);
      sim.status = 'Error en activación';
      // No guardamos aquí tampoco
      throw error; // Re-lanzar el error para manejarlo en handleSim
    }
  }

  // Método para actualizar los datos en el servicio externo (PATCH) para suspencion
  private async updateExternalServiceSuspend(sim: Sim): Promise<void> {
    // console.log('Enviando PATCH al servicio externo para suspender...');
    const token = await this.tokensService.obtenerUltimoToken();
    if (!token) {
      throw new Error("No se pudo obtener el token para la autenticación.");
    }

    const patchData = {
      id: sim.id,
      iccid: sim.iccid,
      status: { id: 3 },  // Cambiado a un objeto
      user: { id: 28 },   // Cambiado a un objeto
      // Incluye otros campos que el servicio externo pueda necesitar
    };
    // console.log('Datos a enviar en el PATCH:', JSON.stringify(patchData, null, 2));

    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${config.apiBaseUrl}/sims`, patchData, {
          headers: { Authorization: `Bearer ${token.token}` }
        })
      );
      // console.log('Respuesta del servicio externo (PATCH):', JSON.stringify(response.data, null, 2));
      sim.status = 'Suspendido';
      //sim.dueDate = new Date();
      //sim.paidDate = new Date();
      sim.lastStatusUpdate = new Date();
      sim.statusId = 3;
      await this.simRepository.save(sim);
    } catch (error) {
      console.error('Error detallado:', error.response?.data);
      throw new Error(`Error al actualizar datos en el servicio externo: ${error.message}`);
    }
  }

  // Método para actualizar los datos en el servicio externo (PATCH)
  private async updateExternalServiceActive(sim: Sim): Promise<void> {
    const token = await this.tokensService.obtenerUltimoToken();
    if (!token) {
      throw new Error("No se pudo obtener el token para la autenticación.");
    }

    const patchData = {
      id: sim.id,
      iccid: sim.iccid,
      status: { id: 2 },  // Cambiado a un objeto
      user: { id: 28 },   // Cambiado a un objeto
    };

    // console.log('Datos a enviar en el PATCH de recarga:', JSON.stringify(patchData, null, 2));

    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${config.apiBaseUrl}/sims`, patchData, {
          headers: { Authorization: `Bearer ${token.token}` }
        })
      );

      sim.status = 'Activo';
      //  sim.dueDate = this.addDaysToDate(sim.dueDate, sim.days);
      //  sim.paidDate = new Date();
      sim.lastStatusUpdate = new Date();
      sim.statusId = 2;
      //   await this.simRepository.save(sim);
    } catch (error) {
      console.error('Error detallado:', error.response?.data);
      throw new Error(`Error al actualizar datos en el servicio externo: ${error.message}`);
    }
  }


  async findSimIdByIccid(iccid: string): Promise<{ id: string }> {
    // console.log('Buscando el ID de una SIM por su ICCID:', iccid);
    const sim = await this.simRepository.findOne({
      where: { iccid },
      select: ['id']
    });

    if (!sim) {
      throw new NotFoundException(`Sim con ICCID ${iccid} no encontrada`);
    }

    return { id: sim.id.toString() };
  }

  async findAll(): Promise<Sim[]> {
    return this.simRepository.find();
  }


  async findOne(iccid: string): Promise<Sim> {
    // Limpiamos el ICCID de espacios y otros caracteres no deseados
    const cleanIccid = iccid.trim();

    // console.log('Buscando SIM con ICCID:', cleanIccid); // Nuevo log

    const sim = await this.simRepository.findOne({
      where: { iccid: cleanIccid }
    });

    if (!sim) {
      // Intentar buscar de forma más flexible
      const sims = await this.simRepository
        .createQueryBuilder('sim')
        .where('sim.iccid LIKE :iccid', { iccid: `%${cleanIccid}%` })
        .getMany();

      //// console.log('SIMs encontradas con búsqueda flexible:', sims.length);
    }

    return sim;
  }

  async update(id: number, updateSimDto: UpdateSimDto): Promise<Sim> {
    // El error ocurre porque el campo 'client' en UpdateSimDto es de tipo string,
    // pero la entidad Sim espera que 'client' sea un objeto de tipo Client o una función que retorne un string.
    // Para solucionarlo, necesitamos extraer el campo client y manejar la actualización de forma diferente:

    const { client, ...updateData } = updateSimDto;
    await this.simRepository.update(id, updateData);
    return this.simRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.simRepository.delete(id);
  }

  async moveToInventory(): Promise<{ message: string }> {
    const queryRunner = this.simRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const simsToMove = await queryRunner.manager.find(Sim, {
        where: { status: 'Inventario' }
      });

      if (simsToMove.length === 0) {
        // console.log('No se encontraron SIMs con estado Inventario para mover.');
        await queryRunner.rollbackTransaction();
        return { message: 'No se encontraron SIMs con estado Inventario para mover.' };
      }

      // Obtener todos los ICCIDs que ya existen en sim_inventories
      const existingIccids = await queryRunner.manager.find(SimInventory, {
        select: ['iccid']
      }).then(records => records.map(record => record.iccid));

      // Filtrar las SIMs que ya existen en sim_inventories
      const uniqueSims = simsToMove.filter(sim => !existingIccids.includes(sim.iccid));
      const duplicateSims = simsToMove.filter(sim => existingIccids.includes(sim.iccid));

      // Contadores para SIMs movidas y duplicados encontrados
      const totalDuplicados = duplicateSims.length;
      const totalMovidas = uniqueSims.length;

      // Eliminar las SIMs duplicadas de la tabla sim
      if (duplicateSims.length > 0) {
        const duplicateIccids = duplicateSims.map(sim => sim.iccid);
        await queryRunner.manager.delete(Sim, { iccid: In(duplicateIccids) });
        // console.log(`Se eliminaron ${totalDuplicados} SIMs con ICCIDs duplicados: ${duplicateIccids.join(', ')}`);
      }

      // Informar si no hay SIMs únicas para mover
      if (uniqueSims.length === 0) {
        // console.log('No hay SIMs únicas para mover después de eliminar duplicados.');
        await queryRunner.commitTransaction();
        return { message: 'No hay SIMs únicas para mover después de eliminar duplicados.' };
      }

      // Mover SIMs únicas a sim_inventories
      for (const sim of uniqueSims) {
        // Preparar los datos para crear en sim_inventories
        const simInventoryDto: CreateSimInventoryDto = {
          clientId: sim.clientId || 0,
          companyClient: sim.companyClient,
          statusId: sim.statusId || 0,
          status: sim.status,
          client: sim.clientName || 'Sin Asignar',
          iccid: sim.iccid!,
          msisdn: sim.msisdn || '',
          // Agrega otros campos necesarios según tu lógica
        };

        await queryRunner.manager.save(SimInventory, simInventoryDto);
        // console.log(`SIM movida a inventario: ICCID ${sim.iccid}`);

        // Eliminar la SIM de la tabla sim
        await queryRunner.manager.delete(Sim, { id: sim.id });
        // console.log(`SIM eliminada de la tabla sim: ID ${sim.id}`);
      }

      await queryRunner.commitTransaction();
      return {
        message: `Operación completada: Se movieron ${totalMovidas} SIMs al inventario y se encontraron ${totalDuplicados} SIMs duplicadas.`
      };

    } catch (error) {
      console.error('Error al mover SIMs a inventario:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }




  async findSimsNearExpiration(): Promise<Sim[]> {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Modificamos la consulta para seleccionar solo los campos necesarios
    return this.simRepository
      .createQueryBuilder('Sim')
      .select([
        'Sim.id',
        'Sim.iccid',
        'Sim.clientId', // Aseguramos que seleccionamos clientId
        'Sim.dueDate',
        'Sim.status'
      ])
      .where('Sim.dueDate < :date', { date: threeDaysFromNow })
      .andWhere('Sim.status = :status', { status: 'Activo' })
      .getMany();
  }

  async obtenerTodasLasSims(): Promise<{
    mensaje: string,
    total: number,
    sims: Sim[]
  }> {
    try {
      console.log('Iniciando consulta a la base de datos');

      const [sims, total] = await this.simRepository.findAndCount({
        order: {
          createdAt: 'DESC'
        }
      });

      console.log(`Se encontraron ${total} SIMs en la base de datos`);

      const respuesta = {
        mensaje: total === 0 
          ? 'No se encontraron SIMs en la base de datos'
          : `Se encontraron ${total} SIMs en la base de datos`,
        total,
        sims: sims.map(sim => ({
          id: sim.id,
          iccid: sim.iccid,
          // Agrega aquí los campos que necesites mostrar
          ...sim
        }))
      };

      console.log('Respuesta preparada:', respuesta);
      return respuesta;

    } catch (error) {
      console.error('Error en el servicio:', error);
      throw new Error(`Error al consultar la base de datos: ${error.message}`);
    }
  }
}
