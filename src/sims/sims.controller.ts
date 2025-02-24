import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SimsService } from './sims.service';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { NotFoundException } from '@nestjs/common';
import { Sim } from './entities/sim.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiTags, ApiHeader } from '@nestjs/swagger';

@ApiTags('Sims')
@Controller('sims')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class SimsController {
  constructor(
    private readonly simsService: SimsService

  ) { }

  //  @Patch(':id')
  //  async updateSim(@Param('id') id: number, @Body() simDto: CreateSimDto): Promise<Sim> {
  //    return this.simsService.update(id, simDto);
  //  }

  @Post()
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear una nueva SIM',
    description: `
      Crea un nuevo registro de SIM en el sistema.
      
      Reglas de negocio:
      - El ICCID debe ser único
      - El ICCID debe tener 19-20 dígitos numéricos
      - El status inicial debe ser válido
      - El clientId debe existir en el sistema
    `
  })
  @ApiBody({
    type: CreateSimDto,
    examples: {
      sim_nueva: {
        value: {
          id: 123456,
          iccid: "8952140061234567890",
          status: "Inventario",
          clientId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'SIM creada exitosamente',
    type: CreateSimDto
  })
  create(@Body() createSimDto: CreateSimDto) {
    return this.simsService.create(createSimDto);
  }


 // @Public()// este decorador es  por si quiero hacer una ruta publica que no este protegida y se pueda acceder sin token 
  @Post('sync')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Sincronizar SIMs',
    description: `
      Sincroniza las SIMs con el sistema externo.
      
      Proceso:
      - Obtiene datos del servicio externo
      - Actualiza registros existentes
      - Crea nuevos registros si es necesario
      - Mantiene consistencia de datos
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Sincronización completada con éxito',
    schema: {
      example: {
        message: "Sincronización completada. Total SIMs: 100, Actualizadas: 80, Nuevas: 20"
      }
    }
  })
  async syncSims() {
    try {
      // console.log('Iniciando sincronización de SIMs');
      const result = await this.simsService.syncSims();
      // console.log( result);
      // console.log('Sincronización de SIMs completada');
      return { message: 'Sincronización completada con éxito', result };
    } catch (error) {
      console.error('Error durante la sincronización de SIMs:', error);
      throw new HttpException('Error durante la sincronización', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Public()
  @Patch(':id/clear-fields')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Limpiar campos de una SIM',
    description: `
      Limpia campos específicos de una SIM.
      
      Campos afectados:
      - name
      - unitName
      - clientId
      - otros campos relacionados
      
      Restricciones:
      - No se pueden limpiar campos obligatorios
      - Se requieren permisos de administrador
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Campos limpiados exitosamente',
    schema: {
      example: {
        message: "Campos de la SIM limpiados correctamente"
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Error al limpiar campos',
    type: String
})
@ApiResponse({
    status: 404,
    description: 'SIM no encontrada',
    type: String
  })
@ApiBody({
    description: 'ID de la SIM a limpiar',
    type: String
  })
  async clearSimFields(@Param('id') id: string) {
    return this.simsService.clearSimFields(id);
  }



  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener una SIM por ID',
    description: `
      Retorna los detalles de una SIM específica.
      
      Información incluida:
      - Datos básicos de la SIM
      - Estado actual
      - Información del cliente
      - Historial de recargas
    `
  })
  @ApiResponse({
    status: 200,
    description: 'SIM encontrada exitosamente',
    type: CreateSimDto
  })
  @ApiBody({
    description: 'ID de la SIM a obtener',
    type: String
  })
  async findOne(@Param('id') id: string) {
    console.log('findOne');
    return this.simsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'SIM actualizada exitosamente.',
    type: CreateSimDto
  })
  @ApiBody({
    description: 'Datos de la SIM a actualizar',
    type: UpdateSimDto
  })
  update(@Param('id') id: string, @Body() updateSimDto: UpdateSimDto) {
    return this.simsService.update(+id, updateSimDto);
  }
 // @Public()
  @Patch(':id/status')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cambiar el estado de una SIM' })
  @ApiResponse({
    status: 200,
    description: 'Estado de la SIM cambiado exitosamente.',
    type: CreateSimDto
  })
  @ApiBody({
    description: 'Datos de la SIM a actualizar',
    type: CreateSimDto
  })
  changeStatus(@Param('id') id: string, @Body() CreateSimDto: CreateSimDto) {
    return this.simsService.changeSimStatus(+id, CreateSimDto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'SIM eliminada exitosamente.',
    type: CreateSimDto
  })
  @ApiBody({
    description: 'ID de la SIM a eliminar',
    type: String
  })
  remove(@Param('id') id: string) {
    return this.simsService.remove(+id);
  }

  @Get('find-sim-id/:iccid')
  @ApiOperation({ summary: 'Buscar el ID de una SIM por su ICCID' })
  @ApiResponse({
    status: 200,
    description: 'ID de la SIM encontrada exitosamente.',
    type: String
  })
  @ApiBody({
    description: 'ICCID de la SIM a buscar',
    type: String
  })
  async findSimIdByIccid(@Param('iccid') iccid: string) {
    return this.simsService.findSimIdByIccid(iccid);
  }

  @Post('handle')
  @ApiOperation({ summary: 'Manejar una SIM' })
  @ApiResponse({
    status: 200,
    description: 'SIM manejada exitosamente.',
    type: Sim
  })
  @ApiBody({
    description: 'Datos de la SIM a manejar',
    type: CreateSimDto
  })
  async handleSim(@Body() createSimDto: CreateSimDto[]): Promise<Sim[]> {
    // console.log('createSimDto HandleSim', createSimDto);
    return this.simsService.handleSim2(createSimDto);
  }
  
  @Public()
  @Post('check-and-suspend')
  @ApiOperation({ summary: 'Revisar y suspender SIMs expiradas' })
  @ApiResponse({
    status: 200,
    description: 'SIMs expiradas revisadas y suspendidas exitosamente.',
    type: String
  })
  @ApiBody({
    description: 'Datos para revisar y suspender SIMs expiradas',
    type: String
  })
  async checkAndSuspendExpiredSims() {
    return this.simsService.checkAndSuspendExpiredSims();
  }
@Public()
  @Post('move-to-inventory')
  @ApiOperation({ summary: 'Mover SIMs al inventario' })
  @ApiResponse({
    status: 200,
    description: 'SIMs movidas al inventario exitosamente.',
    type: String
  })
  @ApiBody({
    description: 'Datos para mover SIMs al inventario',
    type: String
  })
  async moveToInventory() {
    await this.simsService.moveToInventory();
    return { message: 'SIMs movidas al inventario exitosamente' };
  }

  @Public()
  @Get('list/all-sims')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener todas las SIMs de la base de datos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las SIMs con mensaje informativo',
    schema: {
      properties: {
        mensaje: { type: 'string', description: 'Mensaje informativo sobre los resultados' },
        total: { type: 'number', description: 'Total de SIMs encontradas' },
        sims: { type: 'array', description: 'Lista de SIMs' }
      }
    }
  })
  async consultarTodasLasSims() {
    try {
      const resultado = await this.simsService.obtenerTodasLasSims();
      console.log('Respuesta que se enviará al cliente:', resultado);
      
      if (!resultado || !resultado.sims) {
        throw new HttpException({
          mensaje: 'No se encontraron datos',
          total: 0,
          sims: []
        }, HttpStatus.NOT_FOUND);
      }
      
      return {
        mensaje: resultado.mensaje,
        total: resultado.total,
        sims: resultado.sims
      };

    } catch (error) {
      console.error('Error en el controlador:', error);
      throw new HttpException({
        mensaje: 'Error al obtener las SIMs',
        error: error.message,
        total: 0,
        sims: []
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}