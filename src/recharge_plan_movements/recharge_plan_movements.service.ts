import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRechargePlanMovementDto } from './dto/create-recharge_plan_movement.dto';
import { UpdateRechargePlanMovementDto } from './dto/update-recharge_plan_movement.dto';
import Stripe from 'stripe';
import {
  PaymentResponse,
  PaymentProvider,
  PaymentStatus,
  PaymentValidationResult,
} from './payment-response.interface';
import axios from 'axios';
import { RechargePlanMovement } from '../recharge_plan_movements/entities/recharge_plan_movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Sim } from 'src/sims/entities/sim.entity';
import { User } from 'src/users/entities/user.entity';
import { RechargePlan } from 'src/recharge_plans/entities/recharge_plan.entity';
import { Client } from 'src/clients/entities/client.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { SearchMovementsDto } from './interfaces/search-movements.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';
import { GroupedMovement } from './interfaces/grouped-movement.interface';
import { USER_LEVELS } from './constans/user-levels.constants';

@Injectable()
export class RechargePlanMovementsService {
  constructor(
    @InjectRepository(RechargePlanMovement)
    private readonly rechargePlanMovementRepository: Repository<RechargePlanMovement>,
    @InjectRepository(Sim)
    private readonly simRepository: Repository<Sim>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(RechargePlan)
    private readonly rechargePlanRepository: Repository<RechargePlan>,
    private readonly stripeService: StripeService,
    private readonly permissionsService: PermissionsService,
  ) {}
  private readonly logger = new Logger(RechargePlanMovementsService.name);

  async handleStripeWebhook(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Lógica para manejar pago exitoso
          break;
        case 'payment_intent.payment_failed':
          // Lógica para manejar pago fallido
          break;
        // Otros casos según necesites
        default:
          // console.log(`Evento no manejado: ${event.type}`);
      }
    } catch (error) {
      throw new Error(`Error procesando webhook: ${error.message}`);
    }
  }

  private validatePaymentProvider(provider: string): PaymentValidationResult {
    const validProviders: PaymentProvider[] = [
      'STRIPE',
      'MEXPAGO',
      'PAYPAL',
      'BANK_TRANSFER',
      'POS',
    ];
    if (!validProviders.includes(provider as PaymentProvider)) {
      return {
        isValid: false,
        message: `Proveedor de pago no válido. Debe ser uno de: ${validProviders.join(
          ', ',
        )}`,
      };
    }
    return { isValid: true };
  }

  private validateAmount(amount: number): PaymentValidationResult {
    if (amount <= 0) {
      return { isValid: false, message: 'El monto debe ser mayor que 0' };
    }
    return { isValid: true };
  }

  async processPayment(paymentData: {
    provider: string;
    amount: number;
    simId: number;
    userId: number;
    planName: string;
    isFirstPost: boolean;
    currency?: string;
    paymentMethod?: string;
    metadata?: Record<string, any>;
    transactionNumber?: string;
  }): Promise<RechargePlanMovement> {
    this.logger.log(
      `Iniciando procesamiento de pago: ${JSON.stringify(paymentData)}`,
    );

    let paymentResult: PaymentResponse;

    try {
      // Validaciones
      const providerValidation = this.validatePaymentProvider(
        paymentData.provider.toUpperCase(),
      );
      if (!providerValidation.isValid) {
        this.logger.error(
          `Proveedor de pago inválido: ${paymentData.provider}`,
        );
        throw new BadRequestException(providerValidation.message);
      }

      const amountValidation = this.validateAmount(paymentData.amount);
      if (!amountValidation.isValid) {
        this.logger.error(`Monto inválido: ${paymentData.amount}`);
        throw new BadRequestException(amountValidation.message);
      }

      this.logger.log(`Procesando pago con proveedor: ${paymentData.provider}`);

      switch (paymentData.provider.toUpperCase()) {
        case 'STRIPE':
          this.logger.log('Iniciando pago con Stripe');
          paymentResult = await this.processStripePayment(paymentData);
          break;

        case 'MEXPAGO':
          this.logger.log('Iniciando pago con MexPago');
          paymentResult = await this.processMexPagoPayment(paymentData);
          break;

        case 'PAYPAL':
          this.logger.log('Iniciando pago con PayPal');
          paymentResult = await this.processPayPalPayment(paymentData);
          break;

        case 'BANK_TRANSFER':
          this.logger.log('Iniciando pago con Transferencia Bancaria');
          paymentResult = await this.processBankTransfer(paymentData);
          break;

        case 'POS':
          this.logger.log('Iniciando pago con POS');
          paymentResult = await this.processPOSPayment(paymentData);
          break;

        default:
          this.logger.error(`Proveedor no soportado: ${paymentData.provider}`);
          throw new BadRequestException('Proveedor de pago no válido');
      }

      this.logger.log(`Resultado del pago: ${JSON.stringify(paymentResult)}`);

      const payment = await this.createPayment(
        paymentResult.transactionId,
        paymentData.simId,
        paymentData.userId,
        paymentData.planName,
        paymentData.isFirstPost,
        paymentResult.amount,
        paymentResult.provider,
        paymentData.transactionNumber,
        paymentResult.metadata.stripePaymentIntentId,
      );

      payment.paymentStatus = paymentResult.status;
      payment.paymentMetadata = paymentResult.metadata;
      payment.currency = paymentResult.currency;

      return this.rechargePlanMovementRepository.save(payment);
    } catch (error) {
      console.error('Error procesando el pago:', error);
      throw new BadRequestException(
        `Error procesando el pago: ${error.message}`,
      );
    }
  }

  //comisión de 20 % x activacion apartir de la
  //la segunda recarga 10%
  //  al llegar a 1000 recargas al mes 15%
  //  al llegar a 3000 recargas al mes 20%
  //  al llegar a 7500 recargas al mes 25%

  async createPayment(
    paymentId: string,
    simId: number,
    userId: number,
    planName: string,
    isFirstPost: boolean,
    amount: number,
    provider: string,
    transactionNumber: string,
    stripePaymentIntentId: string,
    verifyUser: boolean = true,
    verifyClienteRastreoGo: boolean = false,
  ): Promise<RechargePlanMovement> {
    if (verifyUser) {
      // Verificar si el usuario existe
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }

    if (verifyClienteRastreoGo) {
      // Verificar si el cliente rastreo go existe
      const clienteRastreoGo = await this.clientRepository.findOne({
        where: { id: userId },
      });
      if (!clienteRastreoGo) {
        throw new NotFoundException(
          `ClienteRastreoGo with ID ${userId} not found`,
        );
      }
    }

    const rechargePlan = await this.rechargePlanRepository.findOne({
      where: { name: planName },
    });
    if (!rechargePlan) {
      throw new Error('Recharge plan not found');
    }

    // Verificar si el SIM existe
    const sim = await this.simRepository.findOne({ where: { id: simId } });
    if (!sim) {
      throw new NotFoundException(`Sim with ID ${simId} not found`);
    }

    const payment = new RechargePlanMovement();
    payment.paymentId = paymentId;
    payment.simId = simId;
    payment.userId = userId;
    payment.planName = planName;
    payment.rechargePlan = rechargePlan;
    payment.amount = amount;
    payment.paymentProvider = provider;
    payment.transactionNumber = transactionNumber;
    payment.paymentStatus = 'pending';
    payment.isFirstPost = isFirstPost;
    payment.createdAt = new Date();

    await this.rechargePlanMovementRepository.save(payment);

    // Guardar comisión si isFirstPost es false
    // if (!isFirstPost) {
    //   const comisione = new Comisione();
    //   comisione.userId = userId;
    //   comisione.amount = payment.amount * 0.20;
    //   comisione.createdAt = new Date();
    //   comisione.rechargePlansMovement = payment;
    //   await this.comisioneRepository.save(comisione);
    // }

    sim.paidDate = payment.createdAt;
    sim.dueDate = new Date(
      sim.paidDate.getTime() + rechargePlan.days * 24 * 60 * 60 * 1000,
    );
    sim.days = rechargePlan.days;
    sim.planName = planName;
    sim.rechargePlanId = rechargePlan.id;
    await this.simRepository.save(sim);

    return payment;
  }

  async updateSimInformation(
    simId: number,
    rechargePlanId: number,
  ): Promise<Sim> {
    const rechargePlan = await this.rechargePlanRepository.findOne({
      where: { id: rechargePlanId },
    });
    if (!rechargePlan) {
      throw new NotFoundException(
        `Recharge plan with ID ${rechargePlanId} not found`,
      );
    }

    const sim = await this.simRepository.findOne({ where: { id: simId } });
    if (!sim) {
      throw new NotFoundException(`Sim with ID ${simId} `);
    }

    const currentDate = new Date();
    const dueDate = new Date(
      currentDate.getTime() + rechargePlan.days * 24 * 60 * 60 * 1000,
    );

    sim.paidDate = currentDate;
    sim.dueDate = dueDate;
    sim.days = rechargePlan.days;
    sim.planName = rechargePlan.name;
    sim.rechargePlanId = rechargePlan.id;
    sim.isFirstPost = sim.isFirstPost; // Tomar el dato de la tabla sim

    return this.simRepository.save(sim);
  }

  async create(
    createRechargePlanMovementDto: CreateRechargePlanMovementDto,
  ): Promise<RechargePlanMovement> {
    const {
      paymentId,
      simId,
      userId,
      planName,
      isFirstPost,
      amount,
      provider,
      transactionNumber,
      stripePaymentIntentId,
    } = createRechargePlanMovementDto;
    return this.createPayment(
      paymentId,
      simId,
      userId,
      planName,
      isFirstPost,
      amount,
      provider,
      transactionNumber,
      stripePaymentIntentId,
    );
  }

  async createWithStatusNoAprobado(
    createRechargePlanMovementDto: CreateRechargePlanMovementDto,
    req: any,
  ): Promise<RechargePlanMovement[]> {
    try {
      // console.log('Intentando crear pagos con estado no aprobado createWithStatusNoAprobado');
      const user = req.user;
      // console.log(user,'este es el usuario');
      const { simsarray, permission, ...movementData } =
        createRechargePlanMovementDto;
      let clientId=null;
      let userId=null

      if (user.clientlevel == USER_LEVELS.END_USER) {
        // console.log('Aplicando filtros para usuario final');
        userId=user.id;
        // Usuario final solo ve sus propios movimientos donde userType es "usuario"
   
      }

      if (user.clientlevel == USER_LEVELS.DISTRIBUTOR) {
        // console.log('Aplicando filtros para distribuidor');
        clientId=user.id;
      }
        // Distribuidor ve:
        // 1. Movimientos donde él es el distribuidor
        // 2. Movimientos de sus usuarios finales
      // Obtener permissionNames usando el valor de permiso proporcionado
      const permissionNames =
        await this.permissionsService.getRolesByPermissionValue(permission);

      if (simsarray && simsarray.length > 0) {
        // Crear múltiples movimientos para cada SIM en simsarray
        console.log(
          simsarray,
          'estos son los datos de las sims dentro de simsarray',
        );
        const movements = simsarray.map((sim) => ({
          ...movementData,
          simId: sim.id, // Asegúrate de que 'sim' tenga la propiedad 'id'
          paymentStatus: 'noaprobado',
          userType: permissionNames[0], // Ahora es un array de strings
          clientId: clientId,
          userId: userId,
        }));

        // console.log(`Creando ${movements.length} pagos con estado no aprobado`);

        // Usar el repositorio para insertar múltiples registros
        const createdMovements =
          this.rechargePlanMovementRepository.create(movements);
        const savedMovements =
          await this.rechargePlanMovementRepository.save(createdMovements);

        // console.log('Pagos guardados con estado no aprobado:', savedMovements);
        return savedMovements;
      } else {
        // Crear un único movimiento si simsarray no está presente
        const movement = this.rechargePlanMovementRepository.create({
          ...createRechargePlanMovementDto,
          paymentStatus: 'noaprobado',
          userType: permissionNames[0], // Ahora es un array de strings
          clientId: clientId,
          userId: userId,
        });
        // console.log('Pago creado con estado no aprobado:', movement);
        const savedMovement =
          await this.rechargePlanMovementRepository.save(movement);
        // console.log('Pago guardado con estado no aprobado:', savedMovement);
        return [savedMovement];
      }
    } catch (error) {
      console.error(
        'Error al crear el/los pago(s) con estado no aprobado:',
        error,
      );
      throw new BadRequestException(
        'Error al crear el/los pago(s) con estado no aprobado',
      );
    }
  }

  async findByPaymentId(paymentId: string): Promise<RechargePlanMovement> {
    return this.rechargePlanMovementRepository.findOne({
      where: { paymentId },
    });
  }

  findAll(): Promise<RechargePlanMovement[]> {
    return this.rechargePlanMovementRepository.find();
  }

  // async findOne(id: number): Promise<RechargePlansMovement> {
  //   const movement = await this.rechargePlansMovementRepository.findOne(id);
  //   if (!movement) {
  //     throw new NotFoundException(`RechargePlansMovement with ID ${id} not found`);
  //   }
  //   return movement;
  // }

  // async update(id: number, updateRechargePlansMovementDto: UpdateRechargePlansMovementDto): Promise<RechargePlansMovement> {
  //   const updateResult = await this.rechargePlansMovementRepository.update(id, updateRechargePlansMovementDto);
  //   if (!updateResult.affected) {
  //     throw new NotFoundException(`RechargePlansMovement with ID ${id} not found`);
  //   }
  //   return this.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.rechargePlanMovementRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(
        `RechargePlanMovement with ID ${id} not found`,
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  async mexPago(
    transaccion: string,
    fecha: string,
    monto: string,
    descripcion?: string,
  ) {
    const datos = {
      llave:
        'eyJsbGF2ZSI6Ijg1OTdiNjk2LTc3YzgtNDU0ZC1hZTJmLWRhZWFmNzNmOGZhOCIsImlkT25saW5lIjoiNjFjYTUyZGQtYTM1Yi00YjNjLTlkZjctMDA4ZGYyZTBiZDE0In0=',
      llavePrivada: '222e14d4-030f-4f47-8134-773b105fb211',
      noTransaccion: transaccion,
      fecha: fecha,
      monto: monto,
      descripcion: descripcion,
    };

    //// console.log(datos, 'estos son los datos');
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://dev.mexpago.com/rest/APIWEB/transaccion/validarNoTransaccion',
      headers: {
        'Content-Type': 'application/json',
      },
      data: datos,
    };

    try {
      // console.log('Enviando datos a MexPago:', datos);
      const response = await axios.request(config);
      // console.log('Respuesta de MexPago:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en MexPago:', error.response?.data || error.message);
      throw error;
    }
  }

  ///////////////////////////////////////////////////////////////////////////

  // async mexPago(transaccion: string, fecha: string) {
  //   const datos = {
  //     llave: "eyJsbGF2ZSI6IjM0NTdhOTRkLWVjYTEtNGJjMy04ZWFiLTY5MGIwZTRhOTMwNSIsImlkT25saW5lIjoiZjgyZTVmNTctYmVmMi00MmRjLWE2NGItMWEwYTkwYzQwMjQyIn0=",
  //     llavePrivada: "b4511ad5-20ab-43b4-9149-c816e77c0000",
  //     noTransaccion: transaccion,
  //     fecha: fecha
  //   };
  //   // console.log(datos, 'estos son los datos');

  //   // Simulación de la respuesta de la API
  //   const response = {
  //     estatus: "APROBADA",
  //     mensaje: "Transacción aprobada exitosamente",
  //     datos: {
  //       transaccion: transaccion,
  //       fecha: fecha
  //     }
  //   };

  //   // console.log(response, 'respuesta simulada de mexpago');
  //   return response;
  // }
  //////////////////////////////////////////////////////////////////////

  async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
    await this.rechargePlanMovementRepository.update(
      { paymentId },
      { paymentStatus: status },
    );
  }

  async findByTransactionNumber(
    transactionNumber: string,
  ): Promise<RechargePlanMovement> {
    return this.rechargePlanMovementRepository.findOne({
      where: { transactionNumber },
    });
  }

  private async processStripePayment(
    paymentData: any,
  ): Promise<PaymentResponse> {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      paymentData.amount,
      paymentData.currency || 'mxn',
    );

    return {
      transactionId: paymentIntent.id,
      status: paymentIntent.status === 'succeeded' ? 'approved' : 'pending',
      provider: 'STRIPE',
      metadata: {
        stripePaymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        paymentMethod: paymentData.paymentMethod,
      },
      amount: paymentData.amount,
      currency: paymentData.currency || 'mxn',
    };
  }

  private async processMexPagoPayment(
    paymentData: any,
  ): Promise<PaymentResponse> {
    const transactionNumber = `MP-${Date.now()}`;
    const mexPagoResult = await this.mexPago(
      transactionNumber,
      new Date().toISOString(),
      paymentData.amount.toString(),
      paymentData.description,
    );

    return {
      transactionId: transactionNumber,
      status: mexPagoResult.estatus === 'APROBADA' ? 'aprobado' : 'pending',
      provider: 'MEXPAGO',
      metadata: {
        mexPagoResponse: mexPagoResult,
      },
      amount: paymentData.amount,
      currency: paymentData.currency || 'mxn',
    };
  }

  private async processPayPalPayment(
    paymentData: any,
  ): Promise<PaymentResponse> {
    return {
      transactionId: `PP-${Date.now()}`,
      status: 'pending',
      provider: 'PAYPAL',
      metadata: {
        paypalOrderId: 'temp-id',
      },
      amount: paymentData.amount,
      currency: paymentData.currency || 'mxn',
    };
  }

  private async processBankTransfer(
    paymentData: any,
  ): Promise<PaymentResponse> {
    return {
      transactionId: `BT-${Date.now()}`,
      status: 'pending',
      provider: 'BANK_TRANSFER',
      metadata: {
        bankReference: Date.now().toString(),
      },
      amount: paymentData.amount,
      currency: paymentData.currency || 'mxn',
    };
  }

  private async processPOSPayment(paymentData: any): Promise<PaymentResponse> {
    return {
      transactionId: `POS-${Date.now()}`,
      status: 'pending',
      provider: 'POS',
      metadata: {
        terminalId: 'TEMP-TERMINAL',
      },
      amount: paymentData.amount,
      currency: paymentData.currency || 'mxn',
    };
  }

  async checkPaymentStatus(transactionId: string): Promise<{
    status: string;
    metadata?: Record<string, any>;
  }> {
    const payment = await this.rechargePlanMovementRepository.findOne({
      where: [
        { paymentId: transactionId },
        { stripePaymentIntentId: transactionId },
        { transactionNumber: transactionId },
      ],
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment with transaction ID ${transactionId} not found`,
      );
    }

    // Verificar estado según el proveedor
    switch (payment.paymentProvider.toUpperCase()) {
      case 'STRIPE':
        const stripeStatus = await this.stripeService.retrievePaymentIntent(
          payment.stripePaymentIntentId,
        );
        payment.paymentStatus =
          stripeStatus.status === 'succeeded' ? 'approved' : 'pending';
        break;

      case 'MEXPAGO':
        const mexPagoStatus = await this.mexPago(
          payment.transactionNumber,
          payment.createdAt.toISOString(),
          payment.amount.toString(),
        );
        payment.paymentStatus =
          mexPagoStatus.estatus === 'APROBADA' ? 'approved' : 'pending';
        break;

      case 'PAYPAL':
      case 'BANK_TRANSFER':
      case 'POS':
        // Mantener el estado actual para estos proveedores
        break;

      default:
        throw new BadRequestException('Proveedor de pago no reconocido');
    }

    // Actualizar el estado en la base de datos
    await this.rechargePlanMovementRepository.save(payment);

    return {
      status: payment.paymentStatus,
      metadata: payment.paymentMetadata,
    };
  }

  async updateIsFirstPostBySimId(
    simId: number,
    isFirstPost: boolean,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(RechargePlanMovement)
      : this.rechargePlanMovementRepository;

    const movement = await repo.findOne({
      where: {
        simId,
        paymentStatus: 'pending',
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!movement) {
      throw new NotFoundException(
        `No se encontró movimiento pendiente para la SIM con ID ${simId}`,
      );
    }

    movement.isFirstPost = isFirstPost;
    console.log(
      'Actualización de isFirstPost en RechargePlanMovement iniciada',
    );
    // console.log(movement, 'estos son los datos del movimiento');
    try {
      await repo.save(movement);
      // console.log('Movimiento guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el movimiento:', error);
      throw new Error('Error al guardar el movimiento en la base de datos');
    }
  }

  async updateByActivation(
    id: number,
    data: Partial<RechargePlanMovement>,
    entityManager?: EntityManager,
  ): Promise<RechargePlanMovement> {
    try {
      // console.log('Iniciando updateByActivation para ID:', id);
      // console.log('Datos a actualizar:', JSON.stringify(data, null, 2));

      const repository =
        entityManager?.getRepository(RechargePlanMovement) ||
        this.rechargePlanMovementRepository;

      // console.log('Buscando movimiento pendiente para simId:', id);
      const movement = await repository.findOne({
        where: { simId: id },
        order: { createdAt: 'desc' }, // Ordenar por fecha de creación descendente para obtener el último
        lock: entityManager ? { mode: 'pessimistic_write' } : undefined,
      });
      // console.log(movement, 'estos son los datos del movimiento');

      if (!movement) {
        // console.log('No se encontró movimiento pendiente para ID:', id);
        throw new NotFoundException(`Movement with ID ${id} not found`);
      }

      // console.log('Movimiento encontrado:', JSON.stringify(movement, null, 2));
      Object.assign(movement, data);
      console.log(
        'Movimiento después de actualizar:',
        JSON.stringify(movement, null, 2),
      );

      const savedMovement = await repository.save(movement);
      console.log(
        'Movimiento guardado exitosamente:',
        JSON.stringify(savedMovement, null, 2),
      );

      return savedMovement;
    } catch (error) {
      console.error('Error detallado al actualizar movimiento:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  async searchMovements(
    params: SearchMovementsDto,
    req: any,
  ): Promise<PaginatedResponse<RechargePlanMovement>> {
    try {
      // console.log('Iniciando searchMovements con params:', JSON.stringify(params, null, 2));
      
      const currentUser = req.user;

      // console.log('Nivel de usuario:', currentUser.clientlevel);
      const query = this.rechargePlanMovementRepository
        .createQueryBuilder('movement') // Define el alias base 'movement'
        .leftJoinAndSelect('movement.sim', 'sim') // Join con la tabla sims
        .leftJoinAndSelect('movement.user', 'user') // Join con la tabla users si es necesario
        .leftJoinAndSelect('movement.rechargePlan', 'rechargePlan') // Join con la tabla recharge_plans
        .leftJoinAndSelect('movement.client', 'client'); // Agregamos el join con client

      // Seleccionar campos específicos si es necesario
      query.select([
        'movement',
        'sim.id',
        'sim.iccid',
        'sim.msisdn',
        'sim.status',
        'sim.clientName',
        'sim.name',
        'sim.days',
        'sim.dueDate',
        'sim.planName',
        'sim.activationDate',
        'sim.lastStatusUpdate',
        'sim.isFirstPost',
        'user.username',
        'client.name',

      ]);

      if (currentUser.clientlevel == USER_LEVELS.END_USER) {
        // console.log('Aplicando filtros para usuario final');
        query.andWhere(
          '"movement"."userId" = :userId AND "movement"."userType" = :userType',
          {
            userId: currentUser.id,
            userType: 'usuario',
          },
        );
      }

      if (currentUser.clientlevel == USER_LEVELS.DISTRIBUTOR) {
        // console.log('Aplicando filtros para distribuidor');
        query.andWhere(
          '(' +
            '("movement"."clientId" = :distributorId AND "movement"."userType" = :distributorType) OR ' +
            '("movement"."userId" IN (SELECT id FROM users WHERE "clientId" = :clientId) AND "movement"."userType" = :userType)' +
            ')',
          {
            distributorId: currentUser.id,
            distributorType: 'distribuidor',
            clientId: currentUser.id,
            userType: 'usuario',
          },
        );

        if (params.userId) {
          // console.log('Filtrando por userId específico:', params.userId);
          query.andWhere('"movement"."userId" = :searchUserId', {
            searchUserId: params.userId,
          });
        }
      }
      // Aplicar filtros según los parámetros recibidos
      if (params.startDate && params.endDate) {
        query.andWhere('movement.createdAt BETWEEN :startDate AND :endDate', {
          startDate: params.startDate,
          endDate: params.endDate,
        });
      }

      if (params.userId) {
        query.andWhere('movement.userId = :userId', { userId: params.userId });
      }

      if (params.isFirstPost !== undefined) {
        query.andWhere('movement.isFirstPost = :isFirstPost', {
          isFirstPost: params.isFirstPost,
        });
      }

      if (params.paymentStatus) {
        query.andWhere('movement.paymentStatus = :paymentStatus', {
          paymentStatus: params.paymentStatus,
        });
      }

      // Paginación
      const page = params.page || 1;
      const limit = Math.min(params.limit || 10, 100);
      const skip = (page - 1) * limit;

      query.skip(skip).take(limit);
      
      // Ordenar por fecha de creación descendente
      query.orderBy('movement.createdAt', 'DESC');

      const [items, total] = await query.getManyAndCount();
      console.log(items, 'estos son los items')
      return {
        items,
        meta: {
          totalItems: total,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      console.error('Error en searchMovements:', error);
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);
      throw new InternalServerErrorException('Error al buscar los movimientos');
    }
  }

  private groupMovementsByTransaction(
    items: RechargePlanMovement[],
  ): GroupedMovement[] {
    const groupedByTransaction = {};

    items.forEach((item) => {
      if (!groupedByTransaction[item.transactionNumber]) {
        groupedByTransaction[item.transactionNumber] = {
          transactionNumber: item.transactionNumber,
          createdAt: item.createdAt,
          paymentStatus: item.paymentStatus,
          userId: item.userId,
          paymentProvider: item.paymentProvider,
          paymentMetadata: item.paymentMetadata,
          userType: item.userType,
          items: [item],
          totalAmount: Number(item.amount),
          count: 1,
        };
      } else {
        groupedByTransaction[item.transactionNumber].items.push(item);
        groupedByTransaction[item.transactionNumber].totalAmount += Number(
          item.amount,
        );
        groupedByTransaction[item.transactionNumber].count += 1;
      }
    });

    return Object.values(groupedByTransaction);
  }
}
