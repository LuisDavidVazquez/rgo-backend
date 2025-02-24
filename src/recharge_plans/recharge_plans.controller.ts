import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RechargePlansService } from './recharge_plans.service';
import { CreateRechargePlanDto } from './dto/create-recharge_plan.dto';
import { UpdateRechargePlanDto } from './dto/update-recharge_plan.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Planes de Recarga')
@Controller('recharge-plans')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class RechargePlansController {
  constructor(private readonly rechargePlansService: RechargePlansService) {}

  @Post('/create')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear un nuevo plan de recarga',
    description: `
      Crea un nuevo plan de recarga en el sistema.
      
      Reglas de negocio:
      - El monto debe ser un número positivo
      - La duración en días debe ser mayor a 0
      - El nombre es opcional pero único si se proporciona
      - Se validan los datos según CreateRechargePlanDto
    `
  })
  @ApiBody({
    type: CreateRechargePlanDto,
    examples: {
      plan_basico: {
        value: {
          amount: 15000,
          days: 30,
          name: "Plan Mensual Premium"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Plan de recarga creado exitosamente',
    type: CreateRechargePlanDto
  })
  create(@Body() createRechargePlanDto: CreateRechargePlanDto) {
    return this.rechargePlansService.create(createRechargePlanDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todos los planes de recarga',
    description: `
      Retorna una lista de todos los planes de recarga disponibles.
      
      Información incluida:
      - Detalles del plan
      - Relaciones con movimientos
      - Estado actual
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes encontrada exitosamente',
    type: [CreateRechargePlanDto]
  })
  findAll() {
    return this.rechargePlansService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener un plan de recarga por ID',
    description: 'Busca y retorna un plan de recarga específico por su ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Plan encontrado exitosamente',
    type: CreateRechargePlanDto
  })
  findOne(@Param('id') id: number) {
    return this.rechargePlansService.findOne(id);
  }

  @Patch('/update/:id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar plan de recarga',
    description: `
      Actualiza un plan de recarga existente.
      
      Campos actualizables:
      - Monto
      - Duración en días
      - Nombre
      
      Restricciones:
      - No se puede modificar el ID
      - Se requieren permisos de administrador
      - Se validan los datos según UpdateRechargePlanDto
    `
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del plan a actualizar'
  })
  @ApiBody({
    type: UpdateRechargePlanDto,
    description: 'Datos del plan a actualizar'
  })
  actualizarPlan(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRechargePlanDto: UpdateRechargePlanDto,
  ) {
    return this.rechargePlansService.actualizarPlan(id, updateRechargePlanDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar plan de recarga',
    description: `
      Elimina un plan de recarga del sistema.
      
      Consideraciones:
      - Se verifican dependencias antes de eliminar
      - Se requiere autorización de administrador
      - No se pueden eliminar planes con movimientos activos
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Plan eliminado exitosamente'
  })
  remove(@Param('id') id: number) {
    return this.rechargePlansService.remove(id);
  }

  @Put('/replace-id/:oldId/:newId')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Reemplazar ID de plan de recarga',
    description: `
      Cambia el ID de un plan de recarga existente.
      
      Proceso:
      - Verifica existencia del plan original
      - Verifica que el nuevo ID esté disponible
      - Mantiene todas las relaciones y datos
      - Actualiza referencias
    `
  })
  @ApiResponse({
    status: 200,
    description: 'ID reemplazado exitosamente'
  })
  replaceId(@Param('oldId') oldId: number, @Param('newId') newId: number) {
    return this.rechargePlansService.replaceId(oldId, newId);
  }

  @Get('all/plans')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener planes con mensaje informativo',
    description: `
      Retorna todos los planes con un mensaje descriptivo.
      
      Información incluida:
      - Mensaje con cantidad total
      - Lista completa de planes
      - Detalles de cada plan
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Planes obtenidos exitosamente',
    schema: {
      properties: {
        message: { type: 'string' },
        plans: { 
          type: 'array',
          items: { $ref: '#/components/schemas/RechargePlan' }
        }
      }
    }
  })
  findAllWithMessage() {
    return this.rechargePlansService.findAllWithMessage();
  }
}

