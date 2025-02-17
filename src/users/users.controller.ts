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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/Registercustomer')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 409, description: 'Conflicto - Usuario ya existe' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Public()
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un usuario por su nombre de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiBody({ type: String })
  @Get('by-username/:username')
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException(`Usuario ${username} no encontrado`);
    }
    return user;
  }

  @Public()
  @Get()
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios encontrada exitosamente.',
    type: [CreateUserDto],
  })
  @ApiBody({ type: [CreateUserDto] })
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  //@Public()
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente.',
    type: CreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmailHash(email);
  }
}
