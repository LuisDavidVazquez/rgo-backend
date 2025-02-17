import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from 'src/permissions/entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    await this.permissionRepository.save(permission);
    console.log('Permiso creado exitosamente:', permission.name);
    return permission;
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.permissionRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Permiso con ID "${id}" no encontrado`);
    }
  }

  async findAll(): Promise<any[]> {
    const permissions = await this.permissionRepository.find({
      relations: ['role'],
      select: ['id', 'name', 'value', 'role']
    });
    
    const formattedPermissions = permissions.map(permission => ({
      id: permission.id,
      nombre: permission.name,
      valor: permission.value,
    }));

    return formattedPermissions;
  }

  findOne(id: number) {
    return `Esta acción retorna el permiso #${id}`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `Esta acción actualiza el permiso #${id}`;
  }

  

  async getRoleByPermissionValue(value: string): Promise<Role> {
    const permission = await this.permissionRepository.findOne({
      where: { value },
      relations: ['role'],
    });

    if (!permission) {
      throw new NotFoundException(`Permiso con valor "${value}" no encontrado`);
    }

    if (!permission.role) {
      throw new NotFoundException(`Rol asociado al permiso con valor "${value}" no encontrado`);
    }

    return permission.role;
  }

  
  private storedPermissions: Permission[] = [];

  async getRolesByPermissionValue(userType: string): Promise<string[]> {
    // console.log('Iniciando búsqueda de permisos con valor:', userType);

    const permissions = await this.permissionRepository.find({
      where: { value: userType },
      relations: ['role'],
      select: ['id', 'value', 'name', 'role'] // Especificar campos a seleccionar
    });

    // console.log('Query ejecutado. Resultado raw:', JSON.stringify(permissions, null, 2));

    if (!permissions || permissions.length === 0) {
      throw new NotFoundException(`No se encontraron permisos con el valor "${userType}"`);
    }

    this.storedPermissions = permissions;

    // Obtener el nombre del permiso directamente
    const permissionNames = permissions.map(permission => permission.name);

    if (!permissionNames.length) {
      throw new NotFoundException(`No se encontró el nombre del permiso con el valor "${userType}"`);
    }

    return permissionNames;
  }

  // Método para obtener los permisos almacenados
  getStoredPermissions() {
    return this.storedPermissions;
  }
}

