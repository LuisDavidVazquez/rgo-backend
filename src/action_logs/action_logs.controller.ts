import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionLogsService } from './action_logs.service';
import { CreateActionLogDto } from './dto/create-action_log.dto';
import { UpdateActionLogDto } from './dto/update-action_log.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';

@ApiTags('Registros de Acciones')
@Controller('action-logs')
@ApiBearerAuth()
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class ActionLogsController {
  constructor(private readonly actionLogsService: ActionLogsService) {}

  @Post()
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiOperation({
    summary: 'Crear registro de acción',
    description: `
      Registra una nueva acción en el sistema.
      
      Validaciones:
      - Acción válida y reconocida
      - Usuario autenticado
      - Formato JSON válido para cambios
      - Descripción detallada requerida
      
      Proceso:
      - Registro de timestamp
      - Asociación con usuario
      - Almacenamiento de metadatos
      - Validación de permisos
    `
  })
  @ApiResponse({
    status: 201,
    description: 'Registro de acción creado exitosamente',
    type: CreateActionLogDto
  })
  create(@Body() createActionLogDto: CreateActionLogDto) {
    return this.actionLogsService.create(createActionLogDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los registros',
    description: `
      Lista todos los registros de acciones.
      
      Información incluida:
      - Acción realizada
      - Usuario responsable
      - Timestamp
      - Detalles de cambios
      - Descripción completa
      
      Filtros disponibles:
      - Por fecha
      - Por usuario
      - Por tipo de acción
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros encontrada exitosamente',
    type: [CreateActionLogDto]
  })
  findAll() {
    return this.actionLogsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener registro por ID',
    description: `
      Busca y retorna un registro específico.
      
      Validaciones:
      - ID existente
      - Permisos de acceso
      
      Detalles incluidos:
      - Información completa del registro
      - Metadatos asociados
      - Referencias relacionadas
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado exitosamente',
    type: CreateActionLogDto
  })
  findOne(@Param('id') id: string) {
    return this.actionLogsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar registro',
    description: `
      Actualiza un registro existente.
      
      Campos actualizables:
      - Descripción
      - Metadatos adicionales
      
      Restricciones:
      - No se puede modificar la acción original
      - No se puede cambiar el timestamp
      - Solo administradores
      - Registro de modificación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado exitosamente',
    type: UpdateActionLogDto
  })
  update(@Param('id') id: string, @Body() updateActionLogDto: UpdateActionLogDto) {
    return this.actionLogsService.update(+id, updateActionLogDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar registro',
    description: `
      Elimina un registro del sistema.
      
      Consideraciones:
      - Solo administradores
      - No recomendado (auditoría)
      - Se mantiene respaldo
      - Registro de eliminación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Registro eliminado exitosamente'
  })
  remove(@Param('id') id: string) {
    return this.actionLogsService.remove(+id);
  }
}
