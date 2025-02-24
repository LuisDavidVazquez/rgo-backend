import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Users')
@Controller('users')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/Registercustomer')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: `
      Registra un nuevo usuario en el sistema.
      
      Reglas de negocio:
      - El email debe ser único
      - La contraseña debe cumplir requisitos mínimos de seguridad
      - El username no puede contener caracteres especiales
    `
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      usuario_normal: {
        value: {
          username: "john_doe",
          email: "john@example.com",
          password: "SecurePass123!"
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      example: {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        createdAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos',
    schema: {
      example: {
        message: "Validation failed",
        errors: ["Email inválido", "Contraseña muy débil"]
      }
    }
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Public()
  @ApiBearerAuth('access-token')
  @Get('by-username/:username')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100' })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99' })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60' })
  @ApiOperation({ summary: 'Obtener un usuario por su nombre de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiBody({ type: String })
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`Usuario ${username} no encontrado`);
    }
    return user;
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Obtener lista de usuarios',
    description: `
      Retorna una lista paginada de usuarios.
      
      Parámetros de paginación:
      - page: número de página (default: 1)
      - limit: registros por página (default: 10)
      
      Filtros disponibles:
      - username: búsqueda parcial
      - email: búsqueda exacta
      - createdAt: rango de fechas
      
      Ordenamiento:
      - sort: campo a ordenar
      - order: asc/desc
    `
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            username: "john_doe",
            email: "john@example.com"
          }
        ],
        total: 50,
        page: 1,
        lastPage: 5
      }
    }
  })
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: `
      Actualiza parcialmente los datos de un usuario.
      Solo los campos incluidos serán actualizados.
      
      Campos actualizables:
      - username
      - email
      - password
      
      Los campos no incluidos mantendrán su valor actual.
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
    schema: {
      example: {
        message: "Usuario con ID 1 no encontrado"
      }
    }
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  //@Public()
  @ApiBearerAuth('access-token')
  @Delete(':id')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100' })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99' })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60' })
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente.',
    type: CreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @ApiBearerAuth('access-token')
  @Get('by-email/:email')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100' })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99' })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60' })
  @ApiOperation({ summary: 'Buscar usuario por email' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmailHash(email);
  }
}
