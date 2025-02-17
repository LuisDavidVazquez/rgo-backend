import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({
    status: 200,
    description: 'Notificación creada exitosamente.',
    type: CreateNotificationDto
  })
  @ApiBody({
    description: 'Datos de la notificación a crear',
    type: CreateNotificationDto
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones encontrada exitosamente.',
    type: [CreateNotificationDto]
  })
  @ApiBody({
    description: 'ID del cliente para obtener notificaciones',
    type: Number
  })
  findAll(@Query('clientId') clientId: number) {
    return this.notificationsService.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación encontrada exitosamente.',
    type: CreateNotificationDto
  })
  @ApiBody({
    description: 'ID de la notificación a obtener',
    type: Number
  })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación marcada como leída exitosamente.',
    type: CreateNotificationDto
  })
  @ApiBody({
    description: 'ID de la notificación a marcar como leída',
    type: Number
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
  @ApiOperation({ summary: 'Manejar la expiración de una línea' })
  @ApiResponse({
    status: 200,
    description: 'Expiración de línea manejada exitosamente.',
    type: String
  })
  @ApiBody({
    description: 'Datos para manejar la expiración de una línea',
    schema: {
      type: 'object',
      properties: {
        clientId: {
          type: 'number',
          description: 'ID del cliente',
          example: 123
        },
        iccid: {
          type: 'string', 
          description: 'ICCID de la línea',
          example: '8952140061XXXXXX'
        },
        expirationDate: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de expiración de la línea',
          example: '2024-12-31T23:59:59Z'
        }
      },
      required: ['clientId', 'iccid', 'expirationDate']
    }
  })
  async handleLineExpiration(
    @Body('clientId') clientId: number,
    @Body('iccid') iccid: string,
    @Body('expirationDate') expirationDate: Date
  ) {
    return this.notificationsService.handleLineExpiration(clientId, iccid, new Date(expirationDate));
  }
}