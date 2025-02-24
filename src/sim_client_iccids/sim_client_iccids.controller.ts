import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SimClientIccidsService } from './sim_client_iccids.service';
import { CreateSimClientIccidDto } from './dto/create-sim_client_iccid.dto';
import { UpdateSimClientIccidDto } from './dto/update-sim_client_iccid.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('SIM-Cliente ICCID')
@Controller('sim-client-iccids')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class SimClientIccidsController {
  constructor(private readonly simClientIccidsService: SimClientIccidsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear relación SIM-Cliente ICCID',
    description: `
      Establece una relación entre una SIM y un Cliente ICCID.
      
      Reglas de negocio:
      - La SIM debe existir en el sistema
      - El Cliente ICCID debe existir
      - La relación debe ser única
      - Se ejecuta en una transacción
    `
  })
  @ApiBody({
    type: CreateSimClientIccidDto,
    examples: {
      relacion_basica: {
        value: {
          simId: 1,
          clientIccidId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Relación creada exitosamente',
    schema: {
      example: {
        simId: 1,
        clientIccidId: 1,
        sim: {
          id: 1,
          iccid: "8952140061234567890"
        },
        clientIccid: {
          id: 1,
          name: "Cliente A"
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'SIM o Cliente ICCID no encontrado',
    schema: {
      example: {
        message: "Sim con ID 1 no encontrada"
      }
    }
  })
  create(@Body() createSimClientIccidDto: CreateSimClientIccidDto) {
    // console.log(createSimClientIccidDto,' este es createSimClientIccidDto');
    return this.simClientIccidsService.create(createSimClientIccidDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todas las relaciones SIM-Cliente ICCID',
    description: `
      Retorna todas las relaciones existentes entre SIMs y Clientes ICCID.
      
      Incluye:
      - Datos de la SIM
      - Información del Cliente ICCID
      - Estado de la relación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            simId: 1,
            clientIccidId: 1,
            sim: {
              id: 1,
              iccid: "8952140061234567890"
            },
            clientIccid: {
              id: 1,
              name: "Cliente A"
            }
          }
        ],
        total: 10
      }
    }
  })
  findAll() {
    return this.simClientIccidsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener una relación específica',
    description: 'Busca y retorna una relación SIM-Cliente ICCID específica por ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Relación encontrada exitosamente',
    type: CreateSimClientIccidDto
  })
  findOne(@Param('id') id: string) {
    return this.simClientIccidsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar relación SIM-Cliente ICCID',
    description: `
      Actualiza una relación existente.
      
      Restricciones:
      - No se pueden modificar las claves primarias
      - Solo se permiten actualizaciones de metadatos
      - Se requieren permisos especiales
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Relación actualizada exitosamente'
  })
  update(@Param('id') id: string, @Body() updateSimClientIccidDto: UpdateSimClientIccidDto) {
    return this.simClientIccidsService.update(+id, updateSimClientIccidDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar relación SIM-Cliente ICCID',
    description: `
      Elimina una relación existente.
      
      Consideraciones:
      - Se mantiene historial de la relación
      - Se actualizan estados relacionados
      - Se requiere autorización especial
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Relación eliminada exitosamente'
  })
  remove(@Param('id') id: string) {
    return this.simClientIccidsService.remove(+id);
  }
}
