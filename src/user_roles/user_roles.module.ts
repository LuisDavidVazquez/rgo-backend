import { forwardRef, Module } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { UserRolesController } from './user_roles.controller';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, Role]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
