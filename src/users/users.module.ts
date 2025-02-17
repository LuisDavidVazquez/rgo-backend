import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Role } from 'src/roles/entities/role.entity';
import { MailService } from 'src/Mail.service';
import { AuthModule } from 'src/auth/auth.module';
import { ClientIccidsModule } from '../client_iccids/client_iccids.module';
import { Client } from 'src/clients/entities/client.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { ActionLog } from 'src/action_logs/entities/action_log.entity';
import { ActionLogsModule } from 'src/action_logs/action_logs.module';
import { MailModule } from 'src/Mail.module';
import { UserRolesModule } from 'src/user_roles/user_roles.module';
import { ActionLogsService } from 'src/action_logs/action_logs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Role, Client]), // Asegúrate de que ClientesRastreoGo está listado aquí
    MailModule,
    UserRolesModule,
    // Cualquier otro módulo necesario
    forwardRef(() => AuthModule), // Usa forwardRef para evitar dependencias circulares
    forwardRef(() => ClientIccidsModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => ActionLogsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService], // BitacoraService no necesita ser proveído aquí si ya es exportado por BitacoraModule
  exports: [UsersService, TypeOrmModule, UsersModule], // Asegúrate de exportar TypeOrmModule para hacer el repositorio disponible
})
export class UsersModule {}
