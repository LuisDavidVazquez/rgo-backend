import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { Role } from '../roles/entities/role.entity';
import { Validate } from 'class-validator';
import { IsString } from 'class-validator';
import { Public } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

class GetRoleByValueParam {
  @IsString()
  value: string;
}

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'Crear una nueva permiso' })
  @ApiResponse({
    status: 200,
    description: 'Permiso creado exitosamente.',
    type: CreatePermissionDto
  })
  @ApiBody({
    description: 'Datos del permiso a crear',
    type: CreatePermissionDto
  })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    // console.log(createPermissionDto);
    return this.permissionsService.create(createPermissionDto);
  }
  
  //@Public()
  @Get('all')
  @UseGuards(AuthGuard)        // Opción 2
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los permisos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos encontrada exitosamente.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          nombre: { type: 'string' },
          valor: { type: 'string' },
        }
      }
    }
  })
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un permiso por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Permiso encontrado exitosamente.',
    type: CreatePermissionDto
  })
  @ApiBody({
    description: 'ID del permiso a obtener',
    type: Number
  })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un permiso por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Permiso actualizado exitosamente.',
    type: CreatePermissionDto
  })
  @ApiBody({
    description: 'Datos del permiso a actualizar',
    type: UpdatePermissionDto
  })
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un permiso por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Permiso eliminado exitosamente.',
    type: CreatePermissionDto
  })
  @ApiBody({
    description: 'ID del permiso a eliminar',
    type: Number
  })
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }

  @Get('roles/:value')
  @ApiOperation({ summary: 'Obtener los roles asociados a un permiso por su valor' })
  @ApiParam({ name: 'value', type: 'string', description: 'Valor del permiso' })
  @ApiResponse({
    status: 200,
    description: 'Roles asociados al permiso encontrados exitosamente.',
    type: [Role],
  })
  @ApiBody({
    description: 'Valor del permiso',
    type: String
  })
  
  getRolesByPermissionValue(@Param('value') value: string) {
    // console.log('Valor del permiso recibido en el controlador:', value);
    const result = this.permissionsService.getRolesByPermissionValue(value);
    // console.log('Resultado obtenido del servicio:', result);
    return result;
  }


  @Get('name/:value')
  async getPermissionNames(@Param('value') value: string) {
    try {
      const permissionNames = await this.permissionsService.getRolesByPermissionValue(value);
      return permissionNames;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }



}
