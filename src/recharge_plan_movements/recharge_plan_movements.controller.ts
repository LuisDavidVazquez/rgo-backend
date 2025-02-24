import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  Headers,
  Query,
  Req,
} from '@nestjs/common';
import { RechargePlanMovementsService } from './recharge_plan_movements.service';
import { CreateRechargePlanMovementDto } from './dto/create-recharge_plan_movement.dto';
import { UpdateRechargePlanMovementDto } from './dto/update-recharge_plan_movement.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';
import { StripeService } from 'src/stripe/stripe.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RechargePlanMovement } from './entities/recharge_plan_movement.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { SearchMovementsDto } from './interfaces/search-movements.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';
import { GroupedMovement } from './interfaces/grouped-movement.interface';

@ApiTags('Movimientos de Planes de Recarga')
@Controller('recharge-plan-movements')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class RechargePlanMovementsController {
  constructor(
    private readonly rechargePlanMovementsService: RechargePlanMovementsService,
    private readonly stripeService: StripeService,
    @InjectRepository(RechargePlanMovement)
    private readonly rechargePlanMovementRepository: Repository<RechargePlanMovement>,
  ) {}

  @Get('check-status/:sessionId')
  @ApiOperation({
    summary: 'Verificar estado de pago',
    description: `
      Verifica el estado actual de un pago por su ID de sesión.
      
      Estados posibles:
      - pending: Pago pendiente
      - approved: Pago aprobado
      - rejected: Pago rechazado
      - cancelled: Pago cancelado
      - noaprobado: Pago no aprobado
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del pago verificado exitosamente'
  })
  async checkPaymentStatus(@Param('sessionId') sessionId: string) {
    return this.stripeService.checkPaymentStatus(sessionId);
  }

  async createPayment(
    @Body()
    createPaymentDto: {
      paymentId: string;
      simId: number;
      userId: number;
      planName: string;
      isFirstPost: boolean;
      amount: number;
      provider: string;
      transactionNumber: string;
      stripePaymentIntentId: string;
    },
  ) {
    return this.rechargePlanMovementsService.createPayment(
      createPaymentDto.paymentId,
      createPaymentDto.simId,
      createPaymentDto.userId,
      createPaymentDto.planName,
      createPaymentDto.isFirstPost,
      createPaymentDto.amount,
      createPaymentDto.provider,
      createPaymentDto.transactionNumber,
      createPaymentDto.stripePaymentIntentId,

      true, // verifyUser
      false, // verifyClienteRastreoGo
    );
  }
  @Public()
  @Post()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear movimiento de recarga',
    description: `
      Crea un nuevo movimiento de recarga en el sistema.
      
      Reglas de negocio:
      - Validación de SIM y usuario
      - Procesamiento de pago según proveedor
      - Cálculo de comisiones
      - Actualización de fechas de recarga
      
      Comisiones:
      - 20% por activación
      - 10% segunda recarga en adelante
      - 15% al llegar a 1000 recargas/mes
      - 20% al llegar a 3000 recargas/mes
      - 25% al llegar a 7500 recargas/mes
    `
  })
  @ApiBody({
    type: CreateRechargePlanMovementDto,
    description: 'Datos del movimiento de recarga'
  })
  @ApiResponse({
    status: 201,
    description: 'Movimiento creado exitosamente',
    type: CreateRechargePlanMovementDto
  })
  create(@Body() createRechargePlanMovementDto: CreateRechargePlanMovementDto) {
    return this.rechargePlanMovementsService.create(createRechargePlanMovementDto);
  }

  @Public()
  @Patch('update-sim')
  @ApiOperation({
    summary: 'Actualizar información de SIM',
    description: `
      Actualiza la información de una SIM después de una recarga.
      
      Actualizaciones:
      - Fecha de pago
      - Fecha de vencimiento
      - Días del plan
      - Nombre del plan
      - ID del plan de recarga
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Información de SIM actualizada exitosamente'
  })
  async updateSim(@Body() data: { simId: number; rechargePlanId: number }) {
    return this.rechargePlanMovementsService.updateSimInformation(
      data.simId,
      data.rechargePlanId
    );
  }

  @Post('create-checkout-session')
  @ApiOperation({ summary: 'Crear una sesión de checkout' })
  @ApiResponse({
    status: 200,
    description: 'Sesión de checkout creada exitosamente.',
    type: String,
  })
  @ApiBody({
    description: 'Datos para crear una sesión de checkout',
    type: Object,
  })
  async createCheckoutSession(
    @Body()
    body: {
      stripeData: {
        line_items: Array<{
          price_data: {
            currency: string;
            unit_amount: number;
            product_data: {
              name: string;
              description: string;
            };
          };
          quantity: number;
        }>;
        metadata: {
          simId: string;
          planId: string;
          userId: string;
          iccid: string;
          planDays: string;
          originalAmount: string;
          lineNumber: string;
          simName: string;
          transactionNumber: string;
        };
      };
    },
  ) {
    try {
      console.log(
        'Datos recibidos en el controlador de createCheckoutSession:',
        body,
      );

      const checkoutData = body.stripeData;
      console.log(
        checkoutData.metadata.transactionNumber,
        'esto es checkoutData.metadata.transactionNumber',
      );
      // Extraer los datos necesarios del objeto checkoutData
      const amount = checkoutData.line_items[0].price_data.unit_amount;
      const description =
        checkoutData.line_items[0].price_data.product_data.name;
      const currency = checkoutData.line_items[0].price_data.currency;
      //checkoutData.metadata.transactionNumber = checkoutData.metadata.transactionNumber[0].folio.toString();
      // Crear la sesión de Stripe
      const session = await this.stripeService.createCheckoutSession({
        amount: amount,
        description: description,
        currency: currency,
        metadata: checkoutData.metadata,
        line_items: body.stripeData.line_items,
      });

      const recahgeplanmovement =
        await this.rechargePlanMovementRepository.find({
          where: {
            transactionNumber: checkoutData.metadata.transactionNumber,
          },
        });
      // console.log(recahgeplanmovement, 'esto es el recahgeplanmovement');

      // recahgeplanmovement.paymentId = session.id;
      if (recahgeplanmovement.length > 0) {
        recahgeplanmovement.forEach((movement) => {
          movement.paymentId = session.id;
          movement.paymentProvider = 'STRIPE';
          movement.paymentStatus = 'pending';
          movement.amount = amount;
          movement.stripePaymentIntentId = session.payment_intent as string;
          movement.currency = currency;
          movement.paymentMetadata = checkoutData.metadata;
          movement.rechargePlanId = parseInt(checkoutData.metadata.planId);
        });
        console.log(
          recahgeplanmovement,
          'esto es el recahgeplanmovement dentro del if',
        );
        console.log(
          recahgeplanmovement,
          'esto es el recahgeplanmovement antes de guardar',
        );
        const paymentRecord =
          await this.rechargePlanMovementRepository.save(recahgeplanmovement);
        return {
          id: session.id,
          paymentRecord: paymentRecord,
        };
      } else {
        const recahgeplanmovement = new RechargePlanMovement();
        recahgeplanmovement.paymentStatus = 'noaprobado';
        recahgeplanmovement.paymentId = session.id;
        recahgeplanmovement.paymentProvider = 'STRIPE';
        recahgeplanmovement.amount = amount;
        recahgeplanmovement.stripePaymentIntentId =
          session.payment_intent as string;
        recahgeplanmovement.currency = currency;
        recahgeplanmovement.paymentMetadata = checkoutData.metadata;
        recahgeplanmovement.rechargePlanId = parseInt(
          checkoutData.metadata.planId,
        );
        console.log(
          recahgeplanmovement,
          'esto es el recahgeplanmovement dentro del else',
        );
        const paymentRecord =
          await this.rechargePlanMovementRepository.save(recahgeplanmovement);
        // console.log(paymentRecord, 'esto es el paymentRecord dentro del else');
        return {
          id: session.id,
          paymentRecord: paymentRecord,
        };
      }

      // recahgeplanmovement.;
    } catch (error) {
      console.error('Error detallado al crear sesión:', {
        error,
        message: error.message,
        stack: error.stack,
      });
      throw new BadRequestException(
        `Error al crear sesión de checkout: ${error.message}`,
      );
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Manejar un webhook de Stripe' })
  @ApiResponse({
    status: 200,
    description: 'Webhook manejado exitosamente.',
    type: String,
  })
  @ApiBody({
    description: 'Datos del webhook recibido',
    type: Object,
  })
  async handleWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      //const event = this.stripeService.constructEvent(payload, signature);
      return await this.rechargePlanMovementsService.handleStripeWebhook(
        payload,
      );
    } catch (error) {
      throw new Error(`Error en webhook: ${error.message}`);
    }
  }

  @Public()
  @Get('transaction/:transactionNumber')
  @ApiOperation({
    summary: 'Obtener el ID de una SIM por su número de transacción',
  })
  @ApiResponse({
    status: 200,
    description: 'ID de la SIM encontrada exitosamente.',
    type: String,
  })
  @ApiBody({
    description: 'Número de transacción para obtener el ID de la SIM',
    type: String,
  })
  async getSimId(@Param('transactionNumber') transactionNumber: string) {
    const payment =
      await this.rechargePlanMovementsService.findByTransactionNumber(
        transactionNumber,
      );
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return { simId: payment.simId };
  }
  @Post('noaprobado')
  @ApiOperation({ summary: 'Crear un pago con estado no aprobado' })
  @ApiResponse({
    status: 200,
    description: 'Pago creado con estado no aprobado exitosamente.',
    type: CreateRechargePlanMovementDto,
  })
  @ApiBody({
    description: 'Datos del pago a crear con estado no aprobado',
    type: CreateRechargePlanMovementDto,
  })
  createWithStatusNoAprobado(
    @Req() req,
    
    @Body() createRechargePlanMovementDto: CreateRechargePlanMovementDto,
  ) {
    console.log(req.user, 'esto es lo que llega la back en el request');
    // console.log(createRechargePlanMovementDto, 'esto es lo que llega la back');
    return this.rechargePlanMovementsService.createWithStatusNoAprobado(
      createRechargePlanMovementDto,
      req
    );
  }

  @Post('mexpago')
  @ApiOperation({ summary: 'Crear un pago con estado no aprobado' })
  @ApiResponse({
    status: 200,
    description: 'Pago creado con estado no aprobado exitosamente.',
    type: CreateRechargePlanMovementDto,
  })
  @ApiBody({
    description: 'Datos del pago a crear con estado no aprobado',
    type: CreateRechargePlanMovementDto,
  })
  async request(
    @Body()
    data: {
      noTransaccion: string;
      fecha: string;
      monto: string;
      descripcion?: string;
    },
  ) {
    // console.log('Datos recibidos en el backend:', data);
    const response = await this.rechargePlanMovementsService.mexPago(
      data.noTransaccion,
      data.fecha,
      data.monto,
      data.descripcion,
    );

    // console.log('Respuesta de MexPago en el backend:', response);

    if (response && response.estatus === 'APROBADA') {
      await this.rechargePlanMovementsService.updatePaymentStatus(
        data.noTransaccion,
        'aprobado',
      );
    }
    return response;
  }

  //  @Post('mexpago')
  //  async request(@Body() data: { noTransaccion: string; fecha: string }) {
  //    // console.log('Datos recibidos en el backend:', data);
  //    const response = await this.rechargePlansMovementsService.mexPago(data.noTransaccion, data.fecha);
  //    // console.log('Respuesta de MexPago en el backend:', response);
  //    if (response && response.estatus === "APROBADA") {
  //      await this.rechargePlansMovementsService.updatePaymentStatus(data.noTransaccion, 'aprobado');
  //    }
  //    return response;
  //  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos obtenida exitosamente.',
    type: [CreateRechargePlanMovementDto],
  })
  @ApiBody({
    description: 'Lista de pagos a obtener',
    type: [CreateRechargePlanMovementDto],
  })
  findAll() {
    return this.rechargePlanMovementsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rechargePlansMovementsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRechargePlansMovementDto: UpdateRechargePlansMovementDto) {
  //   return this.rechargePlansMovementsService.update(+id, updateRechargePlansMovementDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago eliminado exitosamente.',
    type: CreateRechargePlanMovementDto,
  })
  @ApiBody({
    description: 'ID del pago a eliminar',
    type: Number,
  })
  remove(@Param('id') id: string) {
    return this.rechargePlanMovementsService.remove(+id);
  }

  ////////////////////////pagos nuevos con stripe y mexpago paypal o tranferencia////////////////////////////////////////////////////////////
  @Post('process-payment')
  @ApiOperation({ summary: 'Procesar un pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago procesado exitosamente.',
    type: CreateRechargePlanMovementDto,
  })
  @ApiBody({
    description: 'Datos del pago a procesar',
    type: CreateRechargePlanMovementDto,
  })
  async processPayment(
    @Body()
    paymentData: {
      provider: string;
      amount: number;
      simId: number;
      userId: number;
      planName: string;
      isFirstPost: boolean;
      currency?: string;
      paymentMethod?: string;
      metadata?: Record<string, any>;
      transactionNumber: string;
      stripePaymentIntentId: string;
      rechargePlanId: number;
    },
  ) {
    return this.rechargePlanMovementsService.processPayment(paymentData);
  }

  //@Get('payment-status/:transactionId')
  //async getPaymentStatus(@Param('transactionId') transactionId: string) {
  //  return this.rechargePlansMovementsService.checkPaymentStatus(transactionId);
  //}

  @Post('stripe/create-payment-intent')
  @ApiOperation({ summary: 'Crear un PaymentIntent de Stripe' })
  @ApiResponse({
    status: 200,
    description: 'PaymentIntent creado exitosamente.',
    type: String,
  })
  @ApiBody({
    description: 'Datos para crear un PaymentIntent de Stripe',
    type: Object,
  })
  async createStripePaymentIntent(
    @Body() paymentData: { amount: number; currency?: string; metadata?: any },
  ) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        paymentData.amount,
        paymentData.currency || 'mxn',
      );

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Error creando PaymentIntent:', error);
      throw new BadRequestException('Error al crear el PaymentIntent');
    }
  }

  @Get('payment-status/:paymentIntentId')
  @ApiOperation({ summary: 'Revisar el estado de un pago' })
  @ApiResponse({
    status: 200,
    description: 'Estado del pago revisado exitosamente.',
    type: String,
  })
  @ApiBody({
    description: 'ID del PaymentIntent a revisar',
    type: String,
  })
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    return this.rechargePlanMovementsService.checkPaymentStatus(
      paymentIntentId,
    );
  }

  @Get('verify-payment/:sessionId')
  @ApiOperation({ summary: 'Verificar un pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago verificado exitosamente.',
    type: String,
  })
  @ApiBody({
    description: 'ID de la sesión de pago a verificar',
    type: String,
  })
  async verifyPayment(@Param('sessionId') sessionId: string) {
    console.log('[Backend Controller] Recibida petición de verificación', {
      sessionId,
    });

    try {
      // Primero verificamos la sesión con Stripe
      // console.log('[Backend Controller] Consultando sesión en Stripe');
      const stripeSession = await this.stripeService.retrieveSession(sessionId);
      console.log('[Backend Controller] Respuesta de Stripe:', {
        paymentStatus: stripeSession.payment_status,
        paymentIntent: stripeSession.payment_intent,
      });
      // Buscamos el registro en nuestra base de datos
      // console.log('[Backend Controller] Buscando registro de pago en BD');
      const paymentRecord = await this.rechargePlanMovementRepository.find({
        where: [
          { paymentId: sessionId },
          { stripePaymentIntentId: stripeSession.payment_intent as string },
        ],
      });
      if (paymentRecord.length === 0) {
        console.error('[Backend Controller] No se encontró registro de pago');
        throw new NotFoundException('Registro de pago no encontrado');
      }
      console.log('[Backend Controller] Registro encontrado:', {
        // id: paymentRecord.id,
        // status: paymentRecord.paymentStatus
      });
      // console.log(paymentRecord, 'paymentRecord');
      // Actualizamos el estado si es necesario
      if (
        stripeSession.payment_status === 'paid' &&
        paymentRecord[0].paymentStatus !== 'approved'
      ) {
        console.log(
          '[Backend Controller] Actualizando estado del pago a approved',
        );
        paymentRecord.forEach((movement) => {
          movement.paymentStatus = 'approved';
        });

        const paymentRecordSaved =
          await this.rechargePlanMovementRepository.save(paymentRecord);
        // console.log(paymentRecordSaved, 'paymentRecordSaved');
      }
      return {
        status: paymentRecord[0].paymentStatus,

        paymentDetails: {
          amount: stripeSession.amount_total,
          currency: stripeSession.currency,
          paymentMethod: stripeSession.payment_method_types?.[0],
          metadata: stripeSession.metadata,
          paymentIntentId: stripeSession.payment_intent,
        },
      };
    } catch (error) {
      console.error('[Backend Controller] Error en verificación:', error);
      throw error;
    }
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar movimientos',
    description: `
      Búsqueda paginada de movimientos con filtros.
      
      Filtros disponibles:
      - Rango de fechas
      - ID de usuario
      - Primera recarga
      - Estado de pago
      
      Paginación:
      - Página actual
      - Límite por página
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda realizada exitosamente',
    type: PaginatedResponse
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Fecha inicial (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Fecha final (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'ID del usuario',
  })
  @ApiQuery({
    name: 'isFirstPost',
    required: false,
    description: 'Filtrar por primera recarga (true/false)',
  })
  @ApiQuery({
    name: 'paymentStatus',
    required: false,
    type: String,
    description: 'Estado del pago (approved, noaprobado, pending)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Registros por página (máx: 100)',
    default: 10,
  })
  async searchMovements(@Query() searchDto: SearchMovementsDto, @Req() req) {
    return this.rechargePlanMovementsService.searchMovements(searchDto, req.user);
  }
}

