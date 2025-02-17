import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ClientIccidsService } from './client_iccids.service';
import { CreateClientIccidDto } from './dto/create-client_iccid.dto';
import { UpdateClientIccidDto } from './dto/update-client_iccid.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('client-iccids')
export class ClientIccidsController {
  constructor(private readonly clientIccidsService: ClientIccidsService) {}

 // @Public()
  @Post('/create')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo cliente iccid' })
  @ApiResponse({
    status: 200,
    description: 'Cliente iccid creado exitosamente.',
    type: CreateClientIccidDto,
  })
  @ApiBody({
    description: 'Datos del cliente iccid a crear',
    type: CreateClientIccidDto,
  })
  async create(@Body() createClientIccidDto: CreateClientIccidDto) {
    try {
      console.log(
        'Datos recibidos:',
        JSON.stringify(createClientIccidDto, null, 2),
      );
      const result =
        await this.clientIccidsService.create(createClientIccidDto);
      return result;
    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        status: error.status,
        response: error.response,
      });
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes iccid' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes iccid encontrada exitosamente.',
    type: [CreateClientIccidDto],
  })
  @ApiBody({
    description: 'Datos del cliente iccid a crear',
    type: CreateClientIccidDto,
  })
  findAll() {
    return this.clientIccidsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente iccid por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente iccid encontrado exitosamente.',
    type: CreateClientIccidDto,
  })
  @ApiBody({
    description: 'Datos del cliente iccid a crear',
    type: CreateClientIccidDto,
  })
  findOne(@Param('id') id: string) {
    return this.clientIccidsService.findOne(+id);
  }
  @Public()
  @Patch('limpiar/:id')
  @ApiOperation({ summary: 'Limpiar campos de un cliente iccid por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Campos del cliente iccid limpiados exitosamente.',
    type: CreateClientIccidDto,
  })
  @ApiBody({
    description: 'Datos del cliente iccid a crear',
    type: CreateClientIccidDto,
  })
  async limpiarCampos(@Param('id') id: string) {
    return this.clientIccidsService.limpiarCampos(+id);
  }

  // @Delete('/limpiar-tabla2')
  // async limpiarTablaCompleta2() {
  //   await this.clienteIccidService.limpiarTablaCompleta2();
  //   return { message: 'La tabla cliente_iccid ha sido limpiada completamente.' };
  // }
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Obtener un cliente iccid por su ID de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Cliente iccid encontrado exitosamente.',
    type: CreateClientIccidDto,
  })
  @ApiBody({
    description: 'Datos del cliente iccid a crear',
    type: CreateClientIccidDto,
  })
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const clienteIccid = await this.clientIccidsService.findByUserId(userId);
      // console.log(clienteIccid, 'este es el cliente iccid');
      return clienteIccid;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cliente iccid por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente iccid actualizado exitosamente.',
    type: CreateClientIccidDto,
  })
  @ApiBody({
    description: 'Datos del cliente iccid a crear',
    type: CreateClientIccidDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateClientIccidDto: UpdateClientIccidDto,
  ) {
    return this.clientIccidsService.update(+id, updateClientIccidDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente iccid por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente iccid eliminado exitosamente.',
    type: CreateClientIccidDto,
  })
  @ApiBody({
    description: 'Datos del cliente iccid a crear',
    type: CreateClientIccidDto,
  })
  remove(@Param('id') id: string) {
    return this.clientIccidsService.remove(+id);
  }

  @Get('/users-with-sims/:clientId')
  @ApiOperation({ summary: 'Obtener usuarios con estado de SIMs' })
  @ApiResponse({
    status: 200,
    description:
      'Lista de usuarios con estado de SIMs encontrada exitosamente.',
    type: [CreateClientDto],
  })
  async getUsersWithSimStatus(@Param('clientId') clientId: string) {
    return await this.clientIccidsService.getUserWithSimStatus(+clientId);
  }

  @Get('sim/:simId')
  @ApiOperation({ summary: 'Obtener ICCIDs por SIM ID' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ICCIDs por SIM ID encontrada exitosamente.',
    type: [CreateClientIccidDto],
  })
  findBySimId(@Param('simId') simId: string) {
    return this.clientIccidsService.findBySimId(+simId);
  }

  @Patch('iccid/:iccid/imei')
  async updateImeiByIccid(
    @Param('iccid') iccid: string,
    @Body() updateClientIccidDto: UpdateClientIccidDto
  ) {
    return this.clientIccidsService.updateByIccid(iccid, updateClientIccidDto);
  }
}
