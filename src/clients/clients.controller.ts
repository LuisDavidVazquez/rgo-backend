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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateFiscalDetailDto } from 'src/fiscal_details/dto/create-fiscal_detail.dto';

@Controller('clients')
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
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
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuarios con estado de SIMs' })
  @ApiResponse({
    status: 200,
    description:
      'Lista de usuarios con estado de SIMs encontrada exitosamente.',
    type: [CreateClientDto],
  })
  async getUsersWithSimStatus(@Param('clientId') clientId: string) {
    // console.log('estos son los usuarios con sims');
    return await this.clientsService.getUserWithSimStatus(+clientId);
  }

  @Get()
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los clientes en rastreo go' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes encontrada exitosamente.',
    type: [CreateClientDto],
  })
  @ApiBody({
    description: 'Lista de clientes a obtener',
    type: [CreateClientDto],
  })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('all-sims')
  @ApiOperation({ summary: 'Obtener todas las SIMs' })
  @ApiResponse({
    status: 200,
    description: 'Lista de SIMs encontrada exitosamente.',
    type: [CreateClientDto],
  })
  @ApiBody({
    description: 'Lista de SIMs a obtener',
    type: [CreateClientDto],
  })
  async getAllSims() {
    return this.clientsService.getAllSims();
  }

  @Get(':id')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un cliente por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente.',
    type: CreateClientDto,
  })
  @ApiBody({
    description: 'Cliente a obtener',
    type: CreateClientDto,
  })
  async findOne(@Param('id') id: string) {
    if (id === 'all-sims') {
      return this.clientsService.getAllSims();
    }
    return this.clientsService.findOne(+id);
  }

  @Get('/search')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar un cliente por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado exitosamente.',
    type: CreateClientDto,
  })
  @ApiBody({
    description: 'Cliente a buscar',
    type: CreateClientDto,
  })
  findByName(@Query('name') name: string) {
    return this.clientsService.findByName(name);
    // O para búsqueda parcial:
    // return this.clientesRastreoGoService.findByNamePartial(name);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un cliente por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado exitosamente.',
    type: CreateClientDto,
  })
  @ApiBody({
    description: 'Cliente a actualizar',
    type: CreateClientDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateClientesRastreoGoDto: UpdateClientDto,
  ) {
    return this.clientsService.update(+id, updateClientesRastreoGoDto);
  }



  @Delete(':id')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un cliente por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente eliminado exitosamente.',
    type: CreateClientDto,
  })
  @ApiBody({
    description: 'Cliente a eliminar',
    type: CreateClientDto,
  })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  @Get('with-details/:id')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un cliente con detalles por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente con detalles encontrado exitosamente.',
    type: CreateClientDto,
  })
  @ApiBody({
    description: 'Cliente con detalles a obtener',
    type: CreateClientDto,
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
  // @ApiBody({
  //   description: 'Lista de SIMs a obtener',
  //   type: [CreateClientDto]
  // })
  //  async getSimsByClientId(@Param('id') id: string) {
  //     // console.log('estos son los sims', id);
  //     return this.clientsService.getSimsByClientId(+id);
  //   }

  @Get('database/stats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de la base de datos' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente'
  })
  async getDatabaseStats() {
    return this.clientsService.getDatabaseStats();
  }
}
