import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ClientRegistrationRequestsService } from './client_registration_requests.service';
import { CreateClientRegistrationRequestDto } from './dto/create-client_registration_request.dto';
import { UpdateClientRegistrationRequestDto } from './dto/update-client_registration_request.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { HttpStatus, NotFoundException } from '@nestjs/common';

@ApiTags('Solicitudes de Registro')
@Controller('client-registration-requests')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class ClientRegistrationRequestsController {
  constructor(private readonly clientRegistrationRequestsService: ClientRegistrationRequestsService) {}

  @Public()
  @Post('/enviar')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Enviar solicitud de registro',
    description: `
      Crea una nueva solicitud de registro de cliente.
      
      Validaciones:
      - Email único y válido
      - Formato de teléfono (10 dígitos)
      - Contraseña segura (mayúsculas, minúsculas, números)
      - RFC válido (si se proporciona)
      
      Proceso:
      - Se crea con estado PENDIENTE
      - Se validan datos fiscales
      - Se registra fecha de solicitud
      - Se notifica al administrador
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud enviada exitosamente',
    type: CreateClientRegistrationRequestDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error al enviar la solicitud' 
  })
  create(@Body() createClientRegistrationRequestDto: CreateClientRegistrationRequestDto) {
    return this.clientRegistrationRequestsService.create(createClientRegistrationRequestDto);
  }

  @Public()
  @Get('/pendientes')
  @ApiOperation({
    summary: 'Obtener solicitudes pendientes',
    description: `
      Lista todas las solicitudes en estado PENDIENTE.
      
      Información incluida:
      - Datos del solicitante
      - Fecha de solicitud
      - Información fiscal
      - Datos de contacto
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes pendientes encontrada exitosamente',
    type: [CreateClientRegistrationRequestDto]
  })
  findAll() {
    return this.clientRegistrationRequestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener solicitud por ID',
    description: `
      Busca y retorna una solicitud específica.
      
      Validaciones:
      - Existencia del ID
      - Permisos de acceso
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud encontrada exitosamente',
    type: CreateClientRegistrationRequestDto
  })
  findOne(@Param('id') id: string) {
    return this.clientRegistrationRequestsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar solicitud',
    description: `
      Actualiza el estado o información de una solicitud.
      
      Estados posibles:
      - PENDIENTE
      - APROBADA
      - RECHAZADA
      
      Acciones automáticas:
      - Notificación al solicitante
      - Registro de cambios
      - Actualización de timestamp
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud actualizada exitosamente',
    type: CreateClientRegistrationRequestDto
  })
  update(@Param('id') id: string, @Body() updateClientRegistrationRequestDto: UpdateClientRegistrationRequestDto) {
    return this.clientRegistrationRequestsService.update(+id, updateClientRegistrationRequestDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar solicitud',
    description: `
      Elimina una solicitud del sistema.
      
      Consideraciones:
      - Verificación de estado
      - Registro de eliminación
      - Notificación si es necesario
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud eliminada exitosamente'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.clientRegistrationRequestsService.remove(id);
    if (!result.affected) {
      throw new NotFoundException(`La solicitud con el ID ${id} no fue encontrada.`);
    }
  }
}


