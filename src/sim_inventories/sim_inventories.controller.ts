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
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { Sim } from '../sims/entities/sim.entity';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('sim-inventories')
export class SimInventoriesController {
  constructor(private readonly simInventoriesService: SimInventoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un inventario de SIM' })
  @ApiResponse({
    status: 200,
    description: 'Inventario de SIM creado exitosamente.',
    type: CreateSimInventoryDto,
  })
  @ApiBody({
    description: 'Datos para crear un inventario de SIM',
    type: CreateSimInventoryDto,
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
  @ApiOperation({ summary: 'Asignar un distribuidor a un inventario de SIM' })
  @ApiResponse({
    status: 200,
    description: 'Distribuidor asignado exitosamente.',
    type: CreateSimInventoryDto,
  })
  @ApiBody({
    description: 'ID de inventario de SIM y ID de distribuidor a asignar',
    type: String,
  })
  async assignDistributor(
    @Param('id') id: string,
    @Param('distributorId') distributorId: string,
  ) {
    const updatedSim = await this.simInventoriesService.assignClient(
      +id,
      +distributorId,
    );
    return { message: 'Distribuidor asignado exitosamente', sim: updatedSim };
  }

  @Post('asignar-sim')
  @ApiOperation({ summary: 'Asignar una SIM a un cliente' })
  @ApiResponse({
    status: 200,
    description: 'SIM asignada exitosamente.',
    type: CreateSimInventoryDto,
  })
  @ApiBody({
    description: 'Datos para asignar una SIM a un cliente',
    schema: {
      type: 'object',
      properties: {
        iccid: {
          type: 'string',
          description: 'ICCID de la SIM a asignar',
        },
        clientName: {
          type: 'string',
          description: 'Nombre del cliente al que se asignará la SIM',
        },
      },
      required: ['iccid', 'clientName'],
    },
  })
  async asignarSimACliente(
    @Body() body: { iccid: string; clientName: string },
  ) {
    try {
      const { iccid, clientName } = body;
      const simAsignada = await this.simInventoriesService.asignarSimACliente(
        iccid,
        clientName,
      );
      return { message: 'SIM asignada exitosamente', sim: simAsignada };
    } catch (error) {
      // Maneja diferentes tipos de errores
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Error al asignar la SIM');
    }
  }

  @Get('inventario/all-sims')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las SIMs en inventario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las SIMs en inventario obtenida exitosamente',
    schema: {
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        total: { type: 'number' },
        data: { 
          type: 'array',
          items: { $ref: '#/components/schemas/SimInventory' }
        },
        metadata: {
          type: 'object',
          properties: {
            activas: { type: 'number' },
            inactivas: { type: 'number' },
            enInventario: { type: 'number' },
            porCompanyClient: {
              type: 'object',
              additionalProperties: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Error interno del servidor',
    schema: {
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        error: { type: 'string' }
      }
    }
  })
  async obtenerTodasLasSims() {
    try {
      return await this.simInventoriesService.findAllSims();
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: 'Error al obtener las SIMs del inventario',
        error: error.message
      });
    }
  }
}
