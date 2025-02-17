/**
 * Módulo para gestionar SIMs
 */
import { Module, forwardRef } from '@nestjs/common';
import { SimsService } from './sims.service';
import { SimsController } from './sims.controller';
import { Sim } from './entities/sim.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { User } from 'src/users/entities/user.entity';
import { NotificationsModule } from 'src/notifications/notifications.module'; // Añade esta línea
import { ClientsModule } from 'src/clients/clients.module';
import { SimInventoriesModule } from 'src/sim_inventories/sim_inventories.module';
import { ClientIccid } from 'src/client_iccids/entities/client_iccid.entity';
import { Client } from 'src/clients/entities/client.entity';
import { ClientIccidsModule } from 'src/client_iccids/client_iccids.module';
import { TokensService } from 'src/tokens/tokens.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { RechargePlanMovementsModule } from 'src/recharge_plan_movements/recharge_plan_movements.module';
import { RechargePlanMovementsService } from 'src/recharge_plan_movements/recharge_plan_movements.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sim, User, Client, ClientIccid]),
    HttpModule,
    TokensModule,
    SimInventoriesModule,
    forwardRef(() => ClientsModule),
    forwardRef(() => Client), // Usa forwardRef para evitar dependencias circulares
    forwardRef(() => ClientIccidsModule), // Usa forwardRef para evitar dependencias circulares
    forwardRef(() => NotificationsModule), // Asegúrate de que esta línea esté presente
    forwardRef(() => RechargePlanMovementsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [SimsController],
  providers: [SimsService, TokensService,TokensModule],
  exports: [TypeOrmModule, SimsService],
})
export class SimsModule {}
