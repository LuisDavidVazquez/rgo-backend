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
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiTags, ApiHeader } from '@nestjs/swagger';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';

@ApiTags('ICCIDs de Clientes')
@Controller('client-iccids')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class ClientIccidsController {
  constructor(private readonly clientIccidsService: ClientIccidsService) {}

  @Post('/create')
  @ApiBearerAuth('access-token')
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiOperation({
    summary: 'Crear asociación ICCID-Cliente',
    description: `
      Crea una nueva asociación entre un ICCID y un cliente.
      
      Validaciones:
      - ICCID único y válido (19-20 dígitos)
      - Usuario existente
      - SIM existente y disponible
      - Nombre de unidad único por cliente
      
      Proceso:
      - Verifica existencia de SIM
      - Sincroniza con proveedor si necesario
      - Crea relaciones en transacción
      - Actualiza estado de SIM
    `
  })
  @ApiResponse({
    status: 201,
    description: 'Asociación ICCID-Cliente creada exitosamente',
    type: CreateClientIccidDto
  })
  async create(@Body() createClientIccidDto: CreateClientIccidDto) {
    return await this.clientIccidsService.create(createClientIccidDto);
  }

  
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener todas las asociaciones ICCID-Cliente',
    description: `
      Lista todas las asociaciones con sus relaciones.
      
      Información incluida:
      - Datos de ICCID
      - Usuario asociado
      - SIMs relacionadas
      - Estado de activación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de asociaciones encontrada exitosamente',
    type: [CreateClientIccidDto]
  })
  findAll() {
    return this.clientIccidsService.findAll();
  }

  @Get('/user/:userId')
  @ApiOperation({
    summary: 'Obtener ICCIDs por usuario',
    description: `
      Busca todas las asociaciones ICCID de un usuario específico.
      
      Detalles incluidos:
      - ICCIDs asignados
      - Estado de cada SIM
      - Información de dispositivos
      - Historial de cambios
    `
  })
  @ApiResponse({
    status: 200,
    description: 'ICCIDs del usuario encontrados exitosamente',
    type: [CreateClientIccidDto]
  })
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.clientIccidsService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar asociación ICCID-Cliente',
    description: `
      Actualiza datos de una asociación existente.
      
      Campos actualizables:
      - Nombre de unidad
      - IMEI
      - GPS
      - Estado activo
      
      Restricciones:
      - No se puede cambiar el ICCID
      - Validaciones de datos
      - Registro de cambios
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Asociación actualizada exitosamente',
    type: UpdateClientIccidDto
  })
  update(@Param('id') id: string, @Body() updateClientIccidDto: UpdateClientIccidDto) {
    return this.clientIccidsService.update(+id, updateClientIccidDto);
  }

  @Patch('iccid/:iccid/imei')
  @ApiOperation({
    summary: 'Actualizar IMEI por ICCID',
    description: `
      Actualiza el IMEI asociado a un ICCID específico.
      
      Validaciones:
      - ICCID existente
      - Formato IMEI válido (15 dígitos)
      - Permisos de modificación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'IMEI actualizado exitosamente',
    type: UpdateClientIccidDto
  })
  async updateImeiByIccid(
    @Param('iccid') iccid: string,
    @Body() updateClientIccidDto: UpdateClientIccidDto
  ) {
    return this.clientIccidsService.updateByIccid(iccid, updateClientIccidDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar asociación ICCID-Cliente',
    description: `
      Elimina una asociación del sistema.
      
      Consideraciones:
      - Verificación de dependencias
      - Actualización de relaciones
      - Registro de eliminación
      - Notificación a servicios relacionados
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Asociación eliminada exitosamente'
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
}
