import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';



@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,

  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role & { message: string }> {
    const permission = await this.permissionRepository.findOne({
      where: { name: createRoleDto.name }
    });
    if (!permission) {
      throw new Error('Permission not found');
    }
    const role = new Role();
    role.name = createRoleDto.name;
    role.permission = permission;

    const savedRole = await this.roleRepository.save(role);

    return {
      ...savedRole,
      message: `El rol ${savedRole.name} se ha creado exitosamente`
    };
  }

  async findByName(name: string): Promise<Role | undefined> {
    return this.roleRepository.findOneBy({ name });
  }

  async userHasRole(userId: number, roleName: string): Promise<boolean> {
    const role = await this.roleRepository.findOneBy({ name: roleName });
    if (!role) {
      return false;
    }

    const userRole = await this.userRoleRepository.findOne({
      where: { user: { id: userId }, role: { id: role.id } }
    });

    return !!userRole;
  }



  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      select: {
        id: true,
        name: true
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

