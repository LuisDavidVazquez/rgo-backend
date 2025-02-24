import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SimRequestsService } from './sim_requests.service';
import { CreateSimRequestDto } from './dto/create-sim_request.dto';
import { UpdateSimRequestDto } from './dto/update-sim_request.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Solicitudes de SIM')
@Controller('sim-requests')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class SimRequestsController {
  constructor(private readonly simRequestsService: SimRequestsService) {}

  @Post('sims')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear solicitud de SIM',
    description: `
      Crea una nueva solicitud de SIM en el sistema.
      
      Reglas de negocio:
      - El cliente debe existir en el sistema
      - La cantidad de SIMs debe ser mayor a 0
      - La dirección de entrega debe ser válida
      - El código postal debe tener formato válido
    `
  })
  @ApiBody({
    type: CreateSimRequestDto,
    examples: {
      solicitud_basica: {
        value: {
          clientId: 12345,
          street: "Av. Revolución 123",
          neighborhood: "Centro",
          postalCode: "12345",
          state: "Ciudad de México",
          city: "CDMX",
          requestedSimsQuantity: 5,
          name: "Juan Pérez"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitud de SIM creada exitosamente',
    schema: {
      example: {
        id: 1,
        clientId: 12345,
        requestedSimsQuantity: 5,
        requestStatus: "Pendiente",
        requestDate: "2024-03-20T10:00:00Z"
      }
    }
  })
  create(@Body() createSimRequestDto: CreateSimRequestDto) {
    return this.simRequestsService.create(createSimRequestDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todas las solicitudes de SIM',
    description: `
      Retorna una lista paginada de solicitudes de SIM.
      
      Filtros disponibles:
      - Estado de la solicitud
      - Fecha de solicitud
      - ID del cliente
      
      Incluye relaciones:
      - Información del cliente
      - Detalles de entrega
    `
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            clientId: 12345,
            requestedSimsQuantity: 5,
            requestStatus: "Pendiente",
            requestDate: "2024-03-20T10:00:00Z",
            client: {
              id: 12345,
              name: "Empresa ABC"
            }
          }
        ],
        total: 50,
        page: 1,
        lastPage: 5
      }
    }
  })
  findAll() {
    return this.simRequestsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener una solicitud de SIM por ID',
    description: 'Retorna los detalles de una solicitud específica incluyendo información del cliente'
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud encontrada exitosamente',
    type: CreateSimRequestDto
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud no encontrada'
  })
  findOne(@Param('id') id: string) {
    return this.simRequestsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar solicitud de SIM',
    description: `
      Actualiza el estado o información de una solicitud existente.
      
      Campos actualizables:
      - Estado de la solicitud
      - Información de entrega
      - Cantidad de SIMs
      
      Restricciones:
      - No se puede modificar el cliente
      - Solo ciertos estados son permitidos
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud actualizada exitosamente'
  })
  update(@Param('id') id: string, @Body() updateSimRequestDto: UpdateSimRequestDto) {
    return this.simRequestsService.update(+id, updateSimRequestDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar solicitud de SIM',
    description: `
      Elimina una solicitud del sistema.
      
      Restricciones:
      - Solo solicitudes pendientes pueden ser eliminadas
      - Se requieren permisos de administrador
      - Se mantiene registro histórico
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud eliminada exitosamente'
  })
  remove(@Param('id') id: string) {
    return this.simRequestsService.remove(+id);
  }
}
