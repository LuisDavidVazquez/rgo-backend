import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RechargePlansService } from './recharge_plans.service';
import { CreateRechargePlanDto } from './dto/create-recharge_plan.dto';
import { UpdateRechargePlanDto } from './dto/update-recharge_plan.dto';
import { ApiBody, ApiResponse, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { RechargePlan } from './entities/recharge_plan.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('recharge-plans')
export class RechargePlansController {
  constructor(private readonly rechargePlansService: RechargePlansService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Crear un plan de recarga' })
  @ApiResponse({
    status: 200,
    description: 'Plan de recarga creado exitosamente.',
    type: CreateRechargePlanDto
  })
  @ApiBody({
    description: 'Datos del plan de recarga a crear',
    type: CreateRechargePlanDto
  })
  create(@Body() createRechargePlanDto: CreateRechargePlanDto) {
    return this.rechargePlansService.create(createRechargePlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes de recarga' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes de recarga encontrada exitosamente.',
    type: [CreateRechargePlanDto]
  })
  @ApiBody({
    description: 'Lista de planes de recarga a obtener',
    type: [CreateRechargePlanDto]
  })
  findAll() {
    return this.rechargePlansService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un plan de recarga por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan de recarga encontrado exitosamente.',
    type: CreateRechargePlanDto
  })
  @ApiBody({
    description: 'ID del plan de recarga a obtener',
    type: Number
  })

  findOne(@Param('id') id: number) {
    return this.rechargePlansService.findOne(id);
  }
  
  @Patch('/update/:id')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un plan de recarga existente' })
  @ApiResponse({
    status: 200,
    description: 'Plan de recarga actualizado exitosamente.',
    type: RechargePlan,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del plan de recarga a actualizar',
  })
  @ApiBody({
    description: 'Datos del plan de recarga a actualizar',
    type: UpdateRechargePlanDto,
  })
  actualizarPlan(

    @Param('id', ParseIntPipe) id: number,
    @Body() updateRechargePlanDto: UpdateRechargePlanDto,
  ) {
    return this.rechargePlansService.actualizarPlan(id, updateRechargePlanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un plan de recarga por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Plan de recarga eliminado exitosamente.',
    type: CreateRechargePlanDto
  })
  @ApiBody({
    description: 'ID del plan de recarga a eliminar',
    type: Number
  })
  remove(@Param('id') id: number) {
    return this.rechargePlansService.remove(id);
  }

  @Put('/replace-id/:oldId/:newId')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reemplazar el ID de un plan de recarga' })
  @ApiResponse({
    status: 200,
    description: 'ID de plan de recarga reemplazado exitosamente.',
    type: String
  })
  @ApiBody({
    description: 'ID del plan de recarga a reemplazar',
    type: Number
  })
  replaceId(@Param('oldId') oldId: number, @Param('newId') newId: number) {
    return this.rechargePlansService.replaceId(oldId, newId);
  }

 // @Public()
  @Get('all/plans')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los planes de recarga con mensaje' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes de recarga con mensaje informativo',
    schema: {
      properties: {
        message: { type: 'string' },
        plans: { 
          type: 'array',
          items: { $ref: '#/components/schemas/RechargePlan' }
        }
      }
    }
  })
  findAllWithMessage() {
    return this.rechargePlansService.findAllWithMessage();
  }

}

