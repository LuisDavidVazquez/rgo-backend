import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear una nueva dirección' })
  @ApiResponse({
    status: 200,
    description: 'Dirección creada exitosamente.',
    type: CreateAddressDto,
  })
  @ApiBody({
    description: 'Datos de la dirección a crear',
    type: CreateAddressDto,
  })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las direcciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de direcciones encontrada exitosamente.',
    type: [CreateAddressDto],
  })
  @ApiBody({
    description: 'Lista de direcciones a obtener',
    type: [CreateAddressDto],
  })
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una dirección por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Dirección encontrada exitosamente.',
    type: CreateAddressDto,
  })
  @ApiBody({
    description: 'ID de la dirección a obtener',
    type: Number,
  })
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una dirección por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Dirección actualizada exitosamente.',
    type: CreateAddressDto,
  })
  @ApiBody({
    description: 'Datos de la dirección a actualizar',
    type: UpdateAddressDto,
  })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una dirección por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Dirección eliminada exitosamente.',
    type: CreateAddressDto,
  })
  @ApiBody({
    description: 'ID de la dirección a eliminar',
    type: Number,
  })
  remove(@Param('id') id: string) {
    try {
      return this.addressesService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get('mexico/estados')
  @ApiOperation({ summary: 'Obtener todos los estados de México' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados de México encontrada exitosamente.',
    type: [String],
  })
  getEstados() {
    return this.addressesService.getEstados();
  }

  @Public()
  @Get('mexico/municipios/:estado')
  @ApiOperation({ summary: 'Obtener todos los municipios de un estado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de municipios encontrada exitosamente.',
    type: [String],
  })
  getMunicipios(@Param('estado') estado: string) {
    return this.addressesService.getMunicipios(estado);
  }
}
