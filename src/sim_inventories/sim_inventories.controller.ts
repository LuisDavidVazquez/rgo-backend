import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { SimInventoriesService } from './sim_inventories.service';
import { CreateSimInventoryDto } from './dto/create-sim_inventory.dto';
import { UpdateSimInventoryDto } from './dto/update-sim_inventory.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Inventario de SIMs')
@Controller('sim-inventories')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class SimInventoriesController {
  constructor(private readonly simInventoriesService: SimInventoriesService) {}

  @Post()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear un nuevo inventario de SIM',
    description: `
      Registra una nueva SIM en el inventario.
      
      Reglas de negocio:
      - El ICCID debe ser único
      - El MSISDN debe ser válido
      - El estado inicial debe ser "inventario"
      - Se debe especificar el cliente de la compañía
    `
  })
  @ApiBody({
    type: CreateSimInventoryDto,
    examples: {
      sim_nueva: {
        value: {
          companyClient: 1,
          statusId: 1,
          status: "inventario",
          client: "Distribuidor Principal",
          iccid: "8952140061234567890",
          msisdn: "5512345678",
          clientId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'SIM registrada en inventario exitosamente'
  })
  create(@Body() createSimInventoryDto: CreateSimInventoryDto) {
    return this.simInventoriesService.create(createSimInventoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los inventarios de SIM' })
  @ApiResponse({
    status: 200,
    description: 'Lista de inventarios de SIM encontrada exitosamente.',
    type: [CreateSimInventoryDto],
  })
  @ApiBody({
    description: 'Lista de inventarios de SIM a obtener',
    type: [CreateSimInventoryDto],
  })
  findAll() {
    return this.simInventoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un inventario de SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventario de SIM encontrado exitosamente.',
    type: CreateSimInventoryDto,
  })
  @ApiBody({
    description: 'ID de inventario de SIM a obtener',
    type: String,
  })
  findOne(@Param('id') id: string) {
    return this.simInventoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un inventario de SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventario de SIM actualizado exitosamente.',
    type: CreateSimInventoryDto,
  })
  @ApiBody({
    description: 'Datos para actualizar un inventario de SIM',
    type: UpdateSimInventoryDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateSimInventoryDto: UpdateSimInventoryDto,
  ) {
    return this.simInventoriesService.update(+id, updateSimInventoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un inventario de SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventario de SIM eliminado exitosamente.',
    type: CreateSimInventoryDto,
  })
  @ApiBody({
    description: 'ID de inventario de SIM a eliminar',
    type: String,
  })
  remove(@Param('id') id: string) {
    return this.simInventoriesService.remove(+id);
  }

  @Post(':id/assign-distributor/:distributorId')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Asignar SIM a distribuidor',
    description: `
      Asigna una SIM del inventario a un distribuidor específico.
      
      Proceso:
      - Verifica existencia de la SIM
      - Valida el distribuidor
      - Actualiza el estado de la SIM
      - Registra la asignación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'SIM asignada exitosamente',
    schema: {
      example: {
        message: "SIM asignada exitosamente al distribuidor",
        sim: {
          id: 1,
          iccid: "8952140061234567890",
          status: "asignada",
          distributorId: 1
        }
      }
    }
  })
  async assignDistributor(
    @Param('id') id: string,
    @Param('distributorId') distributorId: string,
  ) {
    return this.simInventoriesService.assignClient(+id, +distributorId);
  }

  @Post('asignar-sim')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Asignar SIM a cliente final',
    description: `
      Asigna una SIM a un cliente final por ICCID.
      
      Validaciones:
      - ICCID debe existir en inventario
      - Cliente debe estar registrado
      - SIM debe estar disponible
    `
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        iccid: {
          type: 'string',
          description: 'ICCID de la SIM',
          example: "8952140061234567890"
        },
        clientName: {
          type: 'string',
          description: 'Nombre del cliente',
          example: "Juan Pérez"
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'SIM asignada exitosamente al cliente'
  })
  async asignarSimACliente(
    @Body() body: { iccid: string; clientName: string },
  ) {
    return this.simInventoriesService.asignarSimACliente(body.iccid, body.clientName);
  }

  @Get('inventario/all-sims')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todas las SIMs en inventario',
    description: `
      Retorna lista completa de SIMs en inventario con metadata.
      
      Información incluida:
      - Datos básicos de cada SIM
      - Estado actual
      - Estadísticas generales
      - Agrupación por cliente
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de SIMs obtenida exitosamente',
    schema: {
      example: {
        success: true,
        message: "Se encontraron X SIMs en inventario",
        total: 100,
        data: [
          {
            id: 1,
            iccid: "8952140061234567890",
            status: "inventario",
            // ... otros campos
          }
        ],
        metadata: {
          activas: 50,
          inactivas: 30,
          enInventario: 20,
          porCompanyClient: {
            "1": 30,
            "2": 70
          }
        }
      }
    }
  })
  async obtenerTodasLasSims() {
    return this.simInventoriesService.findAllSims();
  }
}
