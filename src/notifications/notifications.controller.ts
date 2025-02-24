import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { NotificationType } from './Enum/notification-type.enum';

@ApiTags('Notificaciones')
@Controller('notifications')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear una nueva notificación',
    description: `
      Crea una nueva notificación en el sistema.
      
      Tipos de notificación disponibles:
      - LINE_EXPIRATION: Expiración de línea
      - INVOICE_DUE: Factura pendiente
      - SIM_ASSIGNMENT: Asignación de SIM
      - ACCOUNT_UPDATE: Actualización de cuenta
      - LINE_EXPIRING_SOON: Línea próxima a expirar
      - GENERAL: Notificación general
      
      Canales de notificación:
      - Portal web
      - Correo electrónico
      - SMS (según preferencias del usuario)
    `
  })
  @ApiBody({
    type: CreateNotificationDto,
    examples: {
      notificacion_expiracion: {
        value: {
          clientId: 123,
          type: NotificationType.LINE_EXPIRATION,
          message: "Su línea expirará en 7 días",
          data: {
            iccid: "8952140061234567890",
            expirationDate: "2024-03-25"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Notificación creada exitosamente',
    type: CreateNotificationDto
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todas las notificaciones',
    description: `
      Retorna todas las notificaciones filtradas por cliente.
      
      Funcionalidades:
      - Filtrado por clientId (opcional)
      - Verificación automática de SIMs próximas a expirar
      - Ordenamiento por fecha de creación
      - Estado de lectura
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones encontrada exitosamente',
    type: [CreateNotificationDto]
  })
  findAll(@Query('clientId') clientId: number) {
    return this.notificationsService.findAll(clientId);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener una notificación por ID',
    description: 'Busca y retorna una notificación específica por su ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación encontrada exitosamente',
    type: CreateNotificationDto
  })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id/read')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Marcar notificación como leída',
    description: `
      Actualiza el estado de lectura de una notificación.
      
      Acciones:
      - Establece la fecha de lectura
      - Actualiza el estado a 'READ'
      - Mantiene registro de la fecha de lectura
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Notificación marcada como leída exitosamente',
    type: CreateNotificationDto
  })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una notificación por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación actualizada exitosamente.',
    type: CreateNotificationDto
  })
  @ApiBody({
    description: 'Datos de la notificación a actualizar',
    type: UpdateNotificationDto
  })
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación eliminada exitosamente.',
    type: CreateNotificationDto
  })
  @ApiBody({
    description: 'ID de la notificación a eliminar',
    type: Number
  })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }

  @Post('line-expiration')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Manejar expiración de línea',
    description: `
      Procesa y crea notificaciones para líneas próximas a expirar.
      
      Proceso:
      - Verifica la fecha de expiración
      - Crea notificación automática
      - Notifica por canales configurados
      - Actualiza estado de la línea
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Expiración de línea manejada exitosamente'
  })
  async handleLineExpiration(
    @Body('clientId') clientId: number,
    @Body('iccid') iccid: string,
    @Body('expirationDate') expirationDate: Date
  ) {
    return this.notificationsService.handleLineExpiration(
      clientId,
      iccid,
      new Date(expirationDate)
    );
  }
}