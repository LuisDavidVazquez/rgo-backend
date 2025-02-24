import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationPreferencesService } from './notification_preferences.service';
import { CreateNotificationPreferenceDto } from './dto/create-notification_preference.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification_preference.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';

@ApiTags('Preferencias de Notificación')
@Controller('notification-preferences')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class NotificationPreferencesController {
  constructor(private readonly notificationPreferencesService: NotificationPreferencesService) {}

  @Post()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear preferencias de notificación',
    description: `
      Crea nuevas preferencias de notificación para un usuario.
      
      Tipos de notificación:
      - ALERT: Alertas importantes
      - UPDATE: Actualizaciones del sistema
      - SYSTEM: Notificaciones del sistema
      - MAINTENANCE: Mantenimiento programado
      - REPORT: Reportes y estadísticas
      
      Canales disponibles:
      - Email (requiere dirección válida)
      - SMS (requiere número telefónico)
      - Portal (habilitado por defecto)
    `
  })
  @ApiBody({
    type: CreateNotificationPreferenceDto,
    examples: {
      preferencias_basicas: {
        value: {
          userId: 1,
          notificationType: 'ALERT',
          email: true,
          sms: false,
          portal: true,
          emailAddress: 'usuario@ejemplo.com',
          phoneNumber: '5512345678'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Preferencias creadas exitosamente',
    type: CreateNotificationPreferenceDto
  })
  create(@Body() createNotificationPreferenceDto: CreateNotificationPreferenceDto) {
    return this.notificationPreferencesService.create(createNotificationPreferenceDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todas las preferencias',
    description: `
      Retorna todas las preferencias de notificación registradas.
      
      Información incluida:
      - Configuración por tipo de notificación
      - Canales habilitados
      - Datos de contacto
      - Estado de lectura
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de preferencias encontrada exitosamente',
    type: [CreateNotificationPreferenceDto]
  })
  findAll() {
    return this.notificationPreferencesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener preferencias por ID',
    description: 'Busca y retorna preferencias específicas por su ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Preferencias encontradas exitosamente',
    type: CreateNotificationPreferenceDto
  })
  findOne(@Param('id') id: string) {
    return this.notificationPreferencesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar preferencias',
    description: `
      Actualiza las preferencias de notificación existentes.
      
      Campos actualizables:
      - Canales de notificación
      - Datos de contacto
      - Tipo de notificación
      
      Validaciones:
      - Email requerido si se habilita canal de email
      - Teléfono requerido si se habilita canal SMS
      - Formato válido para email y teléfono
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Preferencias actualizadas exitosamente',
    type: UpdateNotificationPreferenceDto
  })
  update(@Param('id') id: string, @Body() updateNotificationPreferenceDto: UpdateNotificationPreferenceDto) {
    return this.notificationPreferencesService.update(+id, updateNotificationPreferenceDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar preferencias',
    description: `
      Elimina preferencias de notificación.
      
      Consideraciones:
      - Se mantiene historial de preferencias
      - Se restablecen valores por defecto
      - Se requiere autorización
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Preferencias eliminadas exitosamente'
  })
  remove(@Param('id') id: string) {
    return this.notificationPreferencesService.remove(+id);
  }
}
