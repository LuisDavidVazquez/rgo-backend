import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { RolesGuard } from './roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserRolesModule } from 'src/user_roles/user_roles.module';



@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, Permission]),
    forwardRef(() => UserRolesModule),
  ],
  controllers: [RolesController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RolesService
  ],
  exports: [
    TypeOrmModule, // Esto asegura que todos los repositorios de TypeOrmModule sean exportados
    RolesService
  ]
})
export class RolesModule {}
