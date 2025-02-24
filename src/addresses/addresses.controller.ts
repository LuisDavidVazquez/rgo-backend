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
import { ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiBody } from '@nestjs/swagger';

@ApiTags('Direcciones')
@Controller('addresses')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Public()
  @Post()
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiOperation({
    summary: 'Crear una nueva dirección',
    description: `
      Crea una nueva dirección en el sistema.
      
      Validaciones:
      - Código postal válido (5 dígitos)
      - Estado existente en México
      - Municipio válido para el estado
      - Formato de calle y número
      - Longitud máxima de campos
      
      Proceso:
      - Validación de datos
      - Normalización de textos
      - Creación de registro
      - Asociación con cliente si aplica
    `
  })
  @ApiResponse({
    status: 201,
    description: 'Dirección creada exitosamente',
    type: CreateAddressDto
  })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las direcciones',
    description: `
      Lista todas las direcciones registradas.
      
      Información incluida:
      - Datos completos de dirección
      - Cliente asociado si existe
      - Fechas de creación/actualización
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de direcciones encontrada exitosamente',
    type: [CreateAddressDto]
  })
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una dirección por ID',
    description: `
      Busca y retorna una dirección específica.
      
      Validaciones:
      - ID existente
      - Permisos de acceso
      
      Respuesta:
      - Datos completos de la dirección
      - Relaciones y referencias
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Dirección encontrada exitosamente',
    type: CreateAddressDto
  })
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una dirección',
    description: `
      Actualiza los datos de una dirección existente.
      
      Campos actualizables:
      - Calle y números
      - Colonia
      - Código postal
      - Ciudad/Municipio
      - Estado
      - País
      
      Validaciones:
      - Campos opcionales
      - Formatos válidos
      - Referencias existentes
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Dirección actualizada exitosamente',
    type: UpdateAddressDto
  })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(+id, updateAddressDto);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una dirección',
    description: `
      Elimina una dirección del sistema.
      
      Consideraciones:
      - Verificación de dependencias
      - Eliminación lógica vs física
      - Actualización de relaciones
      - Registro de eliminación
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Dirección eliminada exitosamente'
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
  @ApiOperation({
    summary: 'Obtener estados de México',
    description: `
      Retorna la lista de estados de México.
      
      Formato de respuesta:
      - ID del estado
      - Nombre oficial
      - Ordenados alfabéticamente
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados obtenida exitosamente',
    type: [String]
  })
  getEstados() {
    return this.addressesService.getEstados();
  }

  @Public()
  @Get('mexico/municipios/:estado')
  @ApiOperation({
    summary: 'Obtener municipios por estado',
    description: `
      Retorna los municipios de un estado específico.
      
      Validaciones:
      - Estado existente
      - Nombre normalizado
      
      Formato de respuesta:
      - Lista de nombres oficiales
      - Ordenados alfabéticamente
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de municipios obtenida exitosamente',
    type: [String]
  })
  getMunicipios(@Param('estado') estado: string) {
    return this.addressesService.getMunicipios(estado);
  }
}
