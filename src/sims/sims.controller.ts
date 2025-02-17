import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SimsService } from './sims.service';
import { CreateSimDto } from './dto/create-sim.dto';
import { UpdateSimDto } from './dto/update-sim.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { NotFoundException } from '@nestjs/common';
import { Sim } from './entities/sim.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';



@Controller('sims')
export class SimsController {
  constructor(
    private readonly simsService: SimsService

  ) { }

  //  @Patch(':id')
  //  async updateSim(@Param('id') id: number, @Body() simDto: CreateSimDto): Promise<Sim> {
  //    return this.simsService.update(id, simDto);
  //  }

  @Post()
  create(@Body() createSimDto: CreateSimDto) {
    return this.simsService.create(createSimDto);
  }


 // @Public()// este decorador es  por si quiero hacer una ruta publica que no este protegida y se pueda acceder sin token 
  @Post('sync')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sincronizar SIMs' })
  @ApiResponse({
    status: 200,
    description: 'Sincronización completada con éxito',
    type: String
  })
  @ApiResponse({ status: 400, description: 'Error durante la sincronización' })
  @ApiBody({
    description: 'Datos para sincronizar SIMs',
    type: String
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Limpiar campos de una SIM' })
  @ApiResponse({
    status: 200,
    description: 'Campos limpiados exitosamente',
    type: String
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
  @ApiOperation({ summary: 'Obtener una SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'SIM encontrada exitosamente.',
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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