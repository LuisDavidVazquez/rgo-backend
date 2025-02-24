import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiParam } from '@nestjs/swagger';
import { Role } from '../roles/entities/role.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Permisos')
@Controller('permissions')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Public()
  @Post('create')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Crear un nuevo permiso',
    description: `
      Crea un nuevo permiso en el sistema.
      
      Reglas de negocio:
      - El nombre debe estar en mayúsculas y usar guiones bajos
      - El valor debe estar en minúsculas
      - El roleId debe existir si se proporciona
      - No pueden existir nombres o valores duplicados
    `
  })
  @ApiBody({
    type: CreatePermissionDto,
    examples: {
      permiso_basico: {
        value: {
          name: "GESTIONAR_USUARIOS",
          value: "manage_users",
          roleId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Permiso creado exitosamente',
    type: CreatePermissionDto
  })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get('all')

  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todos los permisos',
    description: `
      Retorna una lista de todos los permisos registrados.
      
      Información incluida:
      - ID del permiso
      - Nombre del permiso
      - Valor del permiso
      - Rol asociado (si existe)
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos encontrada exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          nombre: { type: 'string' },
          valor: { type: 'string' }
        }
      }
    }
  })
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener un permiso por ID',
    description: 'Busca y retorna un permiso específico por su ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso encontrado exitosamente',
    type: CreatePermissionDto
  })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar un permiso',
    description: `
      Actualiza un permiso existente.
      
      Campos actualizables:
      - Nombre del permiso
      - Valor del permiso
      - ID del rol asociado
      
      Restricciones:
      - No se puede modificar el ID
      - Se mantienen las reglas de formato
      - Se validan duplicados
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso actualizado exitosamente',
    type: CreatePermissionDto
  })
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar un permiso',
    description: `
      Elimina un permiso del sistema.
      
      Consideraciones:
      - Se verifican dependencias antes de eliminar
      - Se requiere autorización especial
      - No se pueden eliminar permisos base del sistema
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso eliminado exitosamente'
  })
  async remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }

  @Get('roles/:value')
  @ApiBearerAuth('access-token')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener roles por valor de permiso',
    description: `
      Busca roles asociados a un valor de permiso específico.
      
      Detalles:
      - Busca coincidencia exacta del valor
      - Incluye información del rol
      - Retorna múltiples roles si existen
    `
  })
  @ApiParam({ 
    name: 'value', 
    type: 'string', 
    description: 'Valor del permiso a buscar' 
  })
  @ApiResponse({
    status: 200,
    description: 'Roles encontrados exitosamente',
    type: [Role]
  })
  getRolesByPermissionValue(@Param('value') value: string) {
    return this.permissionsService.getRolesByPermissionValue(value);
  }
}
