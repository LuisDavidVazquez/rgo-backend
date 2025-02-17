import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes } from '@nestjs/common';
import { SimRequestsService } from './sim_requests.service';
import { CreateSimRequestDto } from './dto/create-sim_request.dto';
import { UpdateSimRequestDto } from './dto/update-sim_request.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('sim-requests')
export class SimRequestsController {
  constructor(private readonly simRequestsService: SimRequestsService) {}

  @Post('sims')
  @ApiOperation({ summary: 'Enviar una solicitud de SIM' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de SIM enviada exitosamente.',
    type: CreateSimRequestDto
  })
  @ApiBody({ type: CreateSimRequestDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createSimRequestDto: CreateSimRequestDto) {
    return this.simRequestsService.create(createSimRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las solicitudes de SIM' })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes de SIM encontrada exitosamente.',
    type: [CreateSimRequestDto]
  })
  @ApiBody({ type: [CreateSimRequestDto] })
  async findAll() {
    return await this.simRequestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud de SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de SIM encontrada exitosamente.',
    type: CreateSimRequestDto
  })
  @ApiBody({ type: CreateSimRequestDto })
  findOne(@Param('id') id: string) {
    return this.simRequestsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una solicitud de SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de SIM actualizada exitosamente.',
    type: CreateSimRequestDto
  })
  @ApiBody({ type: UpdateSimRequestDto })
  update(@Param('id') id: string, @Body() updateSimRequestDto: UpdateSimRequestDto) {
    return this.simRequestsService.update(+id, updateSimRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una solicitud de SIM por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de SIM eliminada exitosamente.',
    type: CreateSimRequestDto
  })
  @ApiBody({ type: CreateSimRequestDto })
  remove(@Param('id') id: string) {
    return this.simRequestsService.remove(+id);
  }
}
