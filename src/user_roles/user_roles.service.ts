import { Injectable } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';
import { Role } from 'src/roles/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class UserRolesService {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) {}




 //Verifica si una entidad (usuario o cliente) tiene un rol específico
  async entityHasRole(entityId: number, roleName: string, entityType: 'user' | 'client'): Promise<boolean> {
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      console.error('Role not found:', roleName);
      return false;
    }

    const whereCondition = entityType === 'user' 
      ? { user: { id: entityId }, role: { id: role.id } }
      : { client: { id: entityId }, role: { id: role.id } };

    const userRole = await this.userRoleRepository.findOne({ where: whereCondition });
    return !!userRole;
  }

  async assignRoleToEntity(entityId: number, roleName: string, entityType: 'user' | 'client'): Promise<UserRole | null> {
    const role = await this.roleRepository.findOneBy({ name: roleName });
    if (!role) {
      console.error('Role not found:', roleName);
      return null;
    }

    let entity;
    if (entityType === 'user') {
      entity = await this.userRepository.findOneBy({ id: entityId });
    } else {
      entity = await this.clientRepository.findOneBy({ id: entityId });
    }

    if (!entity) {
      console.error(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found with id:`, entityId);
      return null;
    }

    const userRole = this.userRoleRepository.create({
      [entityType]: entity,
      role: role
    });

    return this.userRoleRepository.save(userRole);
  }



  
  create(createUserRoleDto: CreateUserRoleDto) {
    return 'This action adds a new userRole';
  }

  findAll() {
    return `This action returns all userRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRole`;
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return `This action updates a #${id} userRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRole`;
  }
}
