import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ClientRegistrationRequestsService } from './client_registration_requests.service';
import { CreateClientRegistrationRequestDto } from './dto/create-client_registration_request.dto';
import { UpdateClientRegistrationRequestDto } from './dto/update-client_registration_request.dto';
import { ApiBody } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus, NotFoundException } from '@nestjs/common';
@Controller('client-registration-requests')
export class ClientRegistrationRequestsController {
  constructor(private readonly clientRegistrationRequestsService: ClientRegistrationRequestsService) {}

  @Public() 
  @Post('/enviar')
  @ApiOperation({ summary: 'Enviar una solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud enviada exitosamente.',
    type: CreateClientRegistrationRequestDto
  })
  @ApiResponse({ status: 400, description: 'Error al enviar la solicitud' })

  create(@Body() createClientRegistrationRequestDto: CreateClientRegistrationRequestDto) {
  
    // console.log(createClientRegistrationRequestDto);
    return this.clientRegistrationRequestsService.create(createClientRegistrationRequestDto);
  }
  @Public()
  @Get('/pendientes')
  @ApiOperation({ summary: 'Obtener todas las solicitudes pendientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de solicitudes pendientes encontrada exitosamente.',
    type: [CreateClientRegistrationRequestDto]
  })
  @ApiBody({ type: [CreateClientRegistrationRequestDto] })
  findAll() {
    return this.clientRegistrationRequestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud encontrada exitosamente.',
    type: CreateClientRegistrationRequestDto
  })
  @ApiBody({ type: CreateClientRegistrationRequestDto })
  findOne(@Param('id') id: string) {
    return this.clientRegistrationRequestsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una solicitud por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud actualizada exitosamente.',
    type: CreateClientRegistrationRequestDto
  })
  @ApiBody({ type: UpdateClientRegistrationRequestDto })
  update(@Param('id') id: string, @Body() updateClientRegistrationRequestDto: UpdateClientRegistrationRequestDto) {
    return this.clientRegistrationRequestsService.update(+id, updateClientRegistrationRequestDto);
  }


 @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una solicitud por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Solicitud eliminada exitosamente.',
    type: CreateClientRegistrationRequestDto
  })
  @ApiBody({ type: CreateClientRegistrationRequestDto })
  @HttpCode(HttpStatus.NO_CONTENT) // Indica que no se espera contenido en la respuesta
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.clientRegistrationRequestsService.remove(id);
    if (!result.affected) { // Asegúrate de que el método remove del servicio devuelva el resultado de la operación delete
      throw new NotFoundException(`La solicitud con el ID ${id} no fue encontrada y no se pudo eliminar.`);
    }
  }
}


