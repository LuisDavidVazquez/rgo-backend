import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Roles')
@Controller('roles')
@ApiHeader({
  name: 'X-API-Version',
  description: 'Versión de la API',
  example: '1.0',
  required: false
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiBearerAuth('access-token')
  @Post()
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Crear un nuevo rol',
    description: `
      Crea un nuevo rol en el sistema.
      
      Reglas de negocio:
      - El nombre del rol debe ser único
      - El permissionId debe existir en el sistema
      - Solo administradores pueden crear roles
    `
  })
  @ApiBody({
    type: CreateRoleDto,
    examples: {
      rol_basico: {
        value: {
          name: "editor",
          permissionId: 2
        },
        summary: "Creación de rol básico"
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    schema: {
      example: {
        id: 1,
        name: "editor",
        permissionId: 2,
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
        errors: ["Nombre de rol duplicado", "PermissionId no existe"]
      }
    }
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiBearerAuth('access-token')
  @Get('all')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Obtener lista de roles',
    description: `
      Retorna una lista paginada de roles.
      
      Parámetros de paginación:
      - page: número de página (default: 1)
      - limit: registros por página (default: 10)
      
      Filtros disponibles:
      - name: búsqueda parcial
      - permissionId: búsqueda exacta
      - createdAt: rango de fechas
      
      Ordenamiento:
      - sort: campo a ordenar (name, createdAt)
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
    description: 'Lista de roles obtenida exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: "admin",
            permissionId: 1
          },
          {
            id: 2,
            name: "editor",
            permissionId: 2
          }
        ],
        total: 10,
        page: 1,
        lastPage: 1
      }
    }
  })
  async findAll() {
    return await this.rolesService.findAll();
  }

  @ApiBearerAuth('access-token')
  @Get(':id')
  //@Throttle(100, 60)
  @ApiHeader({ name: 'X-RateLimit-Limit', description: 'Número máximo de solicitudes permitidas', example: '100' })
  @ApiHeader({ name: 'X-RateLimit-Remaining', description: 'Número de solicitudes restantes', example: '99' })
  @ApiHeader({ name: 'X-RateLimit-Reset', description: 'Tiempo en segundos para restablecer el límite', example: '60' })
  @ApiOperation({ 
    summary: 'Get a role by id',
    description: 'Retrieves detailed information about a specific role using its ID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the role to retrieve',
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Role information retrieved successfully.',
    schema: {
      example: {
        id: 1,
        name: "admin",
        permissionId: 1
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Role not found.',
    schema: {
      example: {
        statusCode: 404,
        message: "Role not found",
        error: "Not Found"
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiBearerAuth('access-token')
  @Patch(':id')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Actualizar rol',
    description: `
      Actualiza parcialmente los datos de un rol.
      
      Campos actualizables:
      - name
      - permissionId
      
      Reglas de negocio:
      - No se puede cambiar el rol 'admin'
      - El nuevo nombre debe ser único
      - El permissionId debe existir
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    schema: {
      example: {
        id: 2,
        name: "super_editor",
        permissionId: 3,
        message: "Rol actualizado correctamente"
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
    schema: {
      example: {
        message: "Rol con ID 2 no encontrado"
      }
    }
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  //@Throttle(100, 60)
  @ApiOperation({
    summary: 'Eliminar rol',
    description: `
      Elimina un rol del sistema.
      
      Restricciones:
      - No se puede eliminar el rol 'admin'
      - No se pueden eliminar roles con usuarios asignados
      - Se requieren permisos de administrador
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
    schema: {
      example: {
        message: "Rol eliminado correctamente"
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto al eliminar',
    schema: {
      example: {
        message: "No se puede eliminar el rol porque tiene usuarios asignados"
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}