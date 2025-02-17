import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Commission } from './entities/commission.entity';
import { UpdateCommissionDto } from './dto/update-commission.dto';

@Controller('commissions')
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Crear una nueva comisión' })
  @ApiResponse({
    status: 200,
    description: 'Comisión creada exitosamente.',
    type: CreateCommissionDto,
  })
  @ApiBody({
    description: 'Datos de la comisión a crear',
    type: CreateCommissionDto,
  })
  async create(@Body() createCommissionDto: CreateCommissionDto) {
    return await this.commissionsService.create(createCommissionDto);
    // console.log(createCommissionDto);
    // return this.ComisionesService.create(createComissionDto);
  }

  // create(@Body() body: CreateComisioneDto) {
  //  // console.log(body)
  //   this.ComisionesService.create(body.id, body.activacion, body.comision,
  //     body.idcompañiclient, body.recarga, body.createAt, body.updateAt);
  // }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener una comisión por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Comisión encontrada exitosamente.',
    type: CreateCommissionDto,
  })
  @ApiBody({
    description: 'ID de la comisión a obtener',
    type: Number,
  })
  async findComision(@Param('id') id: number) {
    const comision = await this.commissionsService.findOne(id);
    if (!comision) throw new NotFoundException('No se encontró la comisión');
    return comision;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las comisiones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comisiones encontrada exitosamente.',
    type: [CreateCommissionDto],
  })
  @ApiBody({
    description: 'ID de la comisión a obtener',
    type: Number,
  })
  findAllComisione(@Query('commission') commission: Commission) {
    return this.commissionsService.find(commission);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una comisión por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Comisión encontrada exitosamente.',
    type: CreateCommissionDto,
  })
  @ApiBody({
    description: 'ID de la comisión a obtener',
    type: Number,
  })
  findOne(@Param('id') id: number) {
    // return this.comisionesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una comisión por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Comisión actualizada exitosamente.',
    type: CreateCommissionDto,
  })
  @ApiBody({
    description: 'Datos de la comisión a actualizar',
    type: UpdateCommissionDto,
  })
  updateComicion(@Param('id') id: number, @Body() body: UpdateCommissionDto) {
    const updateData: Partial<Commission> = {
      ...body,
      activation: new Date(body.activation).getTime(), // Convertir Date a number
    };
    return this.commissionsService.update(id, updateData);

    //  return this.comisionesService.update(+id, updateComisioneDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar una comisión por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Comisión eliminada exitosamente.',
    type: CreateCommissionDto,
  })
  @ApiBody({
    description: 'ID de la comisión a eliminar',
    type: Number,
  })
  remove(@Param('id') id: number) {
    return this.commissionsService.remove(id);
    // return this.comissionsService.remove(+id);
  }
}
