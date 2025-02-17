import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiscalDetailsService } from './fiscal_details.service';
import { UpdateFiscalDetailDto } from './dto/update-fiscal_detail.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateFiscalDetailDto } from 'src/fiscal_details/dto/create-fiscal_detail.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('fiscal-details')
export class FiscalDetailsController {
  constructor(
    private readonly fiscalDetailsService: FiscalDetailsService
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo dato fiscal' })
  @ApiResponse({
    status: 200,
    description: 'Dato fiscal creado exitosamente.',
    type: CreateFiscalDetailDto
  })
  @ApiBody({
    description: 'Datos del dato fiscal a crear',
    type: CreateFiscalDetailDto
  })
  create(@Body() createFiscalDetailDto: CreateFiscalDetailDto) {
    return this.fiscalDetailsService.create(createFiscalDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los datos fiscales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de datos fiscales encontrada exitosamente.',
    type: [CreateFiscalDetailDto]
  })
  @ApiBody({
    description: 'Lista de datos fiscales a obtener',
    type: [CreateFiscalDetailDto]
  })
  findAll() {
    return this.fiscalDetailsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un dato fiscal por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Dato fiscal encontrado exitosamente.',
    type: CreateFiscalDetailDto
  })
  @ApiBody({
    description: 'ID del dato fiscal a obtener',
    type: Number
  })
  findOne(@Param('id') id: string) {
    return this.fiscalDetailsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un dato fiscal por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Dato fiscal actualizado exitosamente.',
    type: CreateFiscalDetailDto
  })
  @ApiBody({
    description: 'Datos del dato fiscal a actualizar',
    type: UpdateFiscalDetailDto
  })
  update(@Param('id') id: string, @Body() updateFiscalDetailDto: UpdateFiscalDetailDto) {
    return this.fiscalDetailsService.update(+id, updateFiscalDetailDto);
  }
  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un dato fiscal por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Dato fiscal eliminado exitosamente.',
    type: CreateFiscalDetailDto
  })
  @ApiBody({
    description: 'ID del dato fiscal a eliminar',
    type: Number
  })
  remove(@Param('id') id: string) {
    return this.fiscalDetailsService.remove(+id);
  }

  @Get('by-client/:id')
  @ApiOperation({ summary: 'Obtener un dato fiscal por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Dato fiscal encontrado exitosamente.',
    type: CreateFiscalDetailDto
  })
  findByClient(@Param('id') id: string) {
    return this.fiscalDetailsService.findByClient(+id);
  }
}

