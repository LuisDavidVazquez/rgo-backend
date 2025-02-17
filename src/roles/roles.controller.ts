import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new role',
    description: 'Creates a new role with the specified name and permission ID. This endpoint requires administrative privileges.'
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role creation payload',
    examples: {
      example1: {
        value: {
          name: "admin",
          permissionId: 1
        },
        summary: "Basic role creation example"
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'The role has been successfully created.',
    schema: {
      example: {
        id: 1,
        name: "admin",
        permissionId: 1,
        message: "El rol admin se ha creado exitosamente"
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: ["name must be a string", "permissionId must be a positive number"],
        error: "Bad Request"
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - User is not authenticated.'
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('all')
  @ApiOperation({ 
    summary: 'Get all roles',
    description: 'Retrieves a list of all available roles in the system. Requires authentication.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all roles retrieved successfully.',
    schema: {
      example: [
        {
          id: 1,
          name: "admin"
        },
        {
          id: 2,
          name: "user"
        }
      ]
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - User is not authenticated.'
  })
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
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

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a role',
    description: 'Updates an existing role with new information. Requires administrative privileges.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the role to update',
    type: 'number',
    example: 1
  })
  @ApiBody({
    type: UpdateRoleDto,
    description: 'Role update payload',
    examples: {
      example1: {
        value: {
          name: "super_admin",
          permissionId: 2
        },
        summary: "Basic role update example"
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The role has been successfully updated.',
    schema: {
      example: {
        id: 1,
        name: "super_admin",
        permissionId: 2,
        message: "Role updated successfully"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a role',
    description: 'Removes a role from the system. This action cannot be undone. Requires administrative privileges.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the role to delete',
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The role has been successfully deleted.',
    schema: {
      example: {
        message: "Role successfully deleted"
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
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}