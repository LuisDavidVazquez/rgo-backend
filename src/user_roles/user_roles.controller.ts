import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiHeader, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('User Roles')
@Controller('user-roles')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @ApiBearerAuth('access-token')
  @Post()
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100', required: false })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99', required: false })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60', required: false })
  @ApiOperation({
    summary: 'Asignar rol a usuario',
    description: `
      Asigna un rol específico a un usuario.
      
      Reglas de negocio:
      - El usuario debe existir en el sistema
      - El rol debe existir en el sistema
      - Un usuario puede tener múltiples roles
      - Se requieren permisos de administrador
    `
  })
  @ApiBody({
    type: CreateUserRoleDto,
    examples: {
      asignacion_basica: {
        value: {
          userId: 1,
          roleId: 2
        },
        summary: "Asignación de rol a usuario"
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Rol asignado exitosamente',
    schema: {
      example: {
        id: 1,
        userId: 1,
        roleId: 2,
        createdAt: "2024-03-20T10:00:00Z"
      }
    }
  })
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }

  @ApiBearerAuth('access-token')
  @Get()
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener todas las asignaciones de roles',
    description: `
      Retorna una lista paginada de asignaciones usuario-rol.
      
      Parámetros de paginación:
      - page: número de página (default: 1)
      - limit: registros por página (default: 10)
      
      Filtros disponibles:
      - userId: búsqueda exacta
      - roleId: búsqueda exacta
      - createdAt: rango de fechas
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
    description: 'Lista de asignaciones obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            userId: 1,
            roleId: 2,
            user: { username: "john_doe" },
            role: { name: "editor" }
          }
        ],
        total: 10,
        page: 1,
        lastPage: 1
      }
    }
  })
  findAll() {
    return this.userRolesService.findAll();
  }

  @ApiBearerAuth('access-token')
  @Get(':id')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener una asignación específica',
    description: 'Obtiene los detalles de una asignación usuario-rol específica'
  })
  @ApiResponse({
    status: 200,
    description: 'Asignación encontrada exitosamente',
    schema: {
      example: {
        id: 1,
        userId: 1,
        roleId: 2,
        user: { username: "john_doe" },
        role: { name: "editor" }
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.userRolesService.findOne(+id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar asignación de rol',
    description: `
      Actualiza una asignación usuario-rol existente.
      
      Campos actualizables:
      - roleId
      
      Reglas de negocio:
      - No se puede modificar el userId
      - El nuevo roleId debe existir
      - Se requieren permisos de administrador
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Asignación actualizada exitosamente'
  })
  update(@Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userRolesService.update(+id, updateUserRoleDto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar asignación de rol',
    description: `
      Elimina una asignación usuario-rol.
      
      Restricciones:
      - Se requieren permisos de administrador
      - No se puede eliminar el último rol de un usuario
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Asignación eliminada exitosamente',
    schema: {
      example: {
        message: "Asignación eliminada correctamente"
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.userRolesService.remove(+id);
  }
}
