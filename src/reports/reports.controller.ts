import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Reportes')
@Controller('reports')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear nuevo reporte de comisión',
    description: `
      Crea un nuevo reporte de comisión en el sistema.
      
      Reglas de negocio:
      - El ID de comisión debe existir
      - El reporte se crea con estado activo por defecto
      - Se validan los datos de entrada
    `
  })
  @ApiBody({
    type: CreateReportDto,
    examples: {
      reporte_basico: {
        value: {
          id: 1,
          idcomisiones: 1234
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Reporte creado exitosamente',
    schema: {
      example: {
        id: 1,
        idcomisione: 1234,
        IsActive: true
      }
    }
  })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get('/buscar-por-comisione/:idcomisione')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Buscar reportes por ID de comisión',
    description: `
      Retorna todos los reportes asociados a una comisión específica.
      
      Filtros incluidos:
      - Estado activo/inactivo
      - Fecha de creación
      - Ordenamiento por ID
    `
  })
  @ApiParam({
    name: 'idcomisione',
    description: 'ID de la comisión a buscar',
    type: 'number',
    example: 1234
  })
  @ApiResponse({
    status: 200,
    description: 'Reportes encontrados exitosamente',
    schema: {
      example: [{
        id: 1,
        idcomisione: 1234,
        IsActive: true
      }]
    }
  })
  findByComisioneId(@Param('idcomisione') idcomisione: number) {
    return this.reportsService.findByComisioneId(idcomisione);
  }

  @Get()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todos los reportes',
    description: `
      Retorna una lista de todos los reportes en el sistema.
      
      Información incluida:
      - Datos básicos del reporte
      - Estado de activación
      - Relación con comisiones
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reportes obtenida exitosamente',
    schema: {
      example: [{
        id: 1,
        idcomisione: 1234,
        IsActive: true
      }]
    }
  })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener reporte por ID',
    description: 'Busca y retorna un reporte específico por su ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte encontrado exitosamente',
    type: CreateReportDto
  })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar reporte',
    description: `
      Actualiza un reporte existente.
      
      Campos actualizables:
      - Estado de activación
      - ID de comisión
      
      Restricciones:
      - No se puede modificar el ID del reporte
      - Se requieren permisos especiales
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte actualizado exitosamente'
  })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar reporte',
    description: `
      Elimina un reporte del sistema.
      
      Consideraciones:
      - La eliminación es lógica (IsActive = false)
      - Se mantiene historial
      - Se requiere autorización
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte eliminado exitosamente'
  })
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
