import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Commission } from './entities/commission.entity';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@ApiTags('Comisiones')
@Controller('commissions')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post('/create')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear una nueva comisión',
    description: `
      Crea un nuevo registro de comisión.
      
      Reglas de negocio:
      - La comisión debe ser menor que el monto de recarga
      - Se valida la existencia del cliente
      - Se calculan fechas automáticamente
      - Se puede asociar a un reporte o movimiento
      
      Cálculos automáticos:
      - Timestamp de activación
      - Estado activo por defecto
      - Fechas de creación/actualización
    `
  })
  @ApiBody({
    type: CreateCommissionDto,
    examples: {
      comision_basica: {
        value: {
          companyClientId: 1,
          recharge: 5000,
          commission: 500,
          activation: 1647356400000
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Comisión creada exitosamente',
    type: CreateCommissionDto
  })
  async create(@Body() createCommissionDto: CreateCommissionDto) {
    return await this.commissionsService.create(createCommissionDto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Obtener una comisión por ID',
    description: `
      Busca y retorna una comisión específica.
      
      Validaciones:
      - Existencia del ID
      - Acceso permitido
      - Estado activo
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Comisión encontrada exitosamente',
    type: CreateCommissionDto
  })
  async findComision(@Param('id') id: number) {
    const comision = await this.commissionsService.findOne(id);
    if (!comision) throw new NotFoundException('No se encontró la comisión');
    return comision;
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las comisiones',
    description: `
      Lista todas las comisiones registradas.
      
      Filtros disponibles:
      - Por cliente
      - Por rango de fechas
      - Por estado
      - Por monto
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comisiones encontrada exitosamente',
    type: [CreateCommissionDto]
  })
  findAllComisione(@Query('commission') commission: Commission) {
    return this.commissionsService.find(commission);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una comisión',
    description: `
      Actualiza los datos de una comisión existente.
      
      Campos actualizables:
      - Monto de comisión
      - Estado activo
      - Referencias a reportes/movimientos
      
      Restricciones:
      - No se puede modificar el cliente
      - Validaciones de montos
      - Registro de cambios
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Comisión actualizada exitosamente',
    type: UpdateCommissionDto
  })
  updateComicion(@Param('id') id: number, @Body() body: UpdateCommissionDto) {
    const updateData: Partial<Commission> = {
      ...body,
      activation: new Date(body.activation).getTime(),
    };
    return this.commissionsService.update(id, updateData);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Eliminar una comisión',
    description: `
      Elimina una comisión del sistema.
      
      Consideraciones:
      - Verificación de dependencias
      - Eliminación lógica vs física
      - Registro de eliminación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Comisión eliminada exitosamente'
  })
  remove(@Param('id') id: number) {
    return this.commissionsService.remove(id);
  }
}
