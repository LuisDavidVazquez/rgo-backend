import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CreateFiscalDetailDto } from 'src/fiscal_details/dto/create-fiscal_detail.dto';

@ApiTags('Clientes')
@Controller('clients')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Crear un nuevo cliente en rastreo go' })
  @ApiResponse({
    status: 200,
    description: 'Cliente creado exitosamente.',
    type: CreateClientDto,
  })
  create(
    @Body() createDto: CreateClientDto,
    @Body() addressDTO: CreateAddressDto,
    @Body() fiscalDetailDTO: CreateFiscalDetailDto,
  ) {
    console.log(
      'Creando un nuevo registro de cliente en rastreo go',
      createDto,
    );
    return this.clientsService.create(createDto, addressDTO, fiscalDetailDTO);
  }

  // @Public()
  // @Post('/create-level-1') // Ruta para crear usuarios de nivel 1
 // @Public()
  @Post('/create-superadmin') // Ruta para crear superadministradores
  @ApiOperation({ summary: 'Crear un superadministrador' })
  @ApiResponse({
    status: 200,
    description: 'Superadministrador creado exitosamente.',
    type: CreateClientDto,
  })
  async createSuperadmin(@Body() createDto: CreateClientDto) {
    // console.log('Creando SuperAdmin ', createDto);
    return this.clientsService.createSuperadmin(createDto);
  }

  //@Public()
  @Post('/create-administracion') // Ruta para crear superadministradores
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear un administrador' })
  @ApiResponse({
    status: 200,
    description: 'Administrador creado exitosamente.',
    type: CreateClientDto,
  })
  async createAdministracion(@Body() createDto: CreateClientDto) {
    try {
      return await this.clientsService.createAdministracion(createDto);
    } catch (error) {
      if (error.code === '23505') {
        // Código de error PostgreSQL para violación de unicidad
        throw new ConflictException('Ya existe un cliente con estos datos');
      }
      throw error;
    }
  }

  @Post('/createVentas')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear un usuario de ventas' })
  @ApiResponse({
    status: 200,
    description: 'Usuario de ventas creado exitosamente.',
    type: CreateClientDto,
  })
  async createVentas(@Body() createDto: CreateClientDto) {
    // console.log('Creando unusuacrio de Ventas en rastreo go', createDto);
    return this.clientsService.createVentas(createDto);
  }

  @Post('/create-soporte')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Crear un usuario de soporte' })
  @ApiResponse({
    status: 200,
    description: 'Usuario de soporte creado exitosamente.',
    type: CreateClientDto,
  })
  async createSoporte(@Body() createDto: CreateClientDto) {
    try {
      return await this.clientsService.createSoporte(createDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Ya existe un usuario con estos datos');
      }
      throw error;
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////
  // Nuevas rutas para eliminar datos fiscales y dirección
  @Delete('/remove-datos-fiscales/:clienteId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Eliminar datos fiscales de un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Datos fiscales eliminados exitosamente.',
    type: CreateClientDto,
  })
  removeDatosFiscales(@Param('clienteId') clienteId: number) {
    return this.clientsService.removeFiscalDetail(clienteId);
  }

  @Delete('/remove-direccion/:clienteId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Eliminar dirección de un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Dirección eliminada exitosamente.',
    type: CreateClientDto,
  })
  removeDireccion(@Param('clienteId') clienteId: number) {
    return this.clientsService.removeAddress(clienteId);
  }
  // Nueva ruta para obtener todas las SIMs de los usuarios relacionados al clienteRastreoGo
  @Get('/sims/:clientId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener todas las SIMs de un cliente en rastreo go',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de SIMs encontrada exitosamente.',
    type: [CreateClientDto],
  })
  getSimsByClienteRastreoGo(@Param('clientId') clientId: number) {
    // console.log('estos son los sims', clientId);
    return this.clientsService.getSimsByClientId(clientId);
  }

  // Nuevo endpoint para obtener usuarios por distributorId
  @Get('/users/:clientId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener usuarios por distributorId' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios encontrada exitosamente.',
    type: [CreateClientDto],
  })
  async getUsersByDistributorId(@Param('clientId') clientId: string) {
    return await this.clientsService.getUsersByDistributorId(+clientId);
  }

  // Nuevo endpoint para obtener usuarios con estado de SIMs
  @Get('/users-with-sims/:clientId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener usuarios con estado de SIMs',
    description: `
      Lista usuarios con información detallada de sus SIMs.
      
      Información incluida:
      - Datos del usuario
      - Estado de SIMs
      - Fechas de activación
      - Detalles de planes
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios con estado de SIMs encontrada exitosamente',
    type: [CreateClientDto]
  })
  async getUsersWithSimStatus(@Param('clientId') clientId: string) {
    // console.log('estos son los usuarios con sims');
    return await this.clientsService.getUserWithSimStatus(+clientId);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener todos los clientes',
    description: `
      Lista todos los clientes registrados.
      
      Filtros disponibles:
      - Por estado activo
      - Por nivel de cliente
      - Por plataforma externa
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes encontrada exitosamente',
    type: [CreateClientDto]
  })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('all-sims')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener todas las SIMs',
    description: `
      Lista todas las SIMs registradas en el sistema.
      
      Información incluida:
      - Estado de activación
      - Plan asignado
      - Cliente asociado
      - Fechas relevantes
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de SIMs encontrada exitosamente',
    type: [CreateClientDto]
  })
  async getAllSims() {
    return this.clientsService.getAllSims();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener cliente por ID',
    description: `
      Busca y retorna un cliente específico.
      
      Detalles incluidos:
      - Información básica
      - Datos fiscales
      - Direcciones
      - SIMs asociadas
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente',
    type: CreateClientDto
  })
  async findOne(@Param('id') id: string) {
    if (id === 'all-sims') {
      return this.clientsService.getAllSims();
    }
    return this.clientsService.findOne(+id);
  }

  @Get('/search')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Buscar cliente por nombre',
    description: `
      Realiza búsqueda de clientes por nombre.
      
      Características:
      - Búsqueda exacta
      - Case sensitive
      - Retorna múltiples coincidencias
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente',
    type: CreateClientDto
  })
  findByName(@Query('name') name: string) {
    return this.clientsService.findByName(name);
    // O para búsqueda parcial:
    // return this.clientesRastreoGoService.findByNamePartial(name);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Actualizar cliente',
    description: `
      Actualiza datos de un cliente existente.
      
      Campos actualizables:
      - Información básica
      - Datos fiscales
      - Direcciones
      - Estado activo
      
      Restricciones:
      - No se puede modificar el email
      - Validaciones de datos fiscales
      - Registro de cambios
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente',
    type: CreateClientDto
  })
  update(
    @Param('id') id: string,
    @Body() updateClientesRastreoGoDto: UpdateClientDto,
  ) {
    return this.clientsService.update(+id, updateClientesRastreoGoDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Eliminar cliente',
    description: `
      Elimina un cliente del sistema.
      
      Consideraciones:
      - Verificación de dependencias
      - Eliminación de relaciones
      - Registro en bitácora
      - Notificación por email
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente eliminado exitosamente'
  })
  @ApiBody({
    description: 'Cliente a eliminar',
    type: CreateClientDto,
  })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  @Get('with-details/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener cliente con detalles',
    description: `
      Retorna información completa del cliente.
      
      Detalles incluidos:
      - Datos fiscales completos
      - Direcciones registradas
      - Historial de movimientos
      - Relaciones con usuarios
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente con detalles encontrado exitosamente',
    type: CreateClientDto
  })
  findOneWithDetails(@Param('id') id: string) {
    return this.clientsService.findOneWithDetails(+id);
  }

  // @Get('sims/:id')
  // @ApiOperation({ summary: 'Obtener todas las SIMs de un cliente por su ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Lista de SIMs encontrada exitosamente.',
  //   type: [CreateClientDto]
  // })
  //  async getSimsByClientId(@Param('id') id: string) {
  //     // console.log('estos son los sims', id);
  //     return this.clientsService.getSimsByClientId(+id);
  //   }

  @Get('database/stats')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtener estadísticas de la base de datos',
    description: `
      Retorna estadísticas generales del sistema.
      
      Métricas incluidas:
      - Total de clientes
      - SIMs activas
      - Distribución por niveles
      - Uso de recursos
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente'
  })
  async getDatabaseStats() {
    return this.clientsService.getDatabaseStats();
  }
}
