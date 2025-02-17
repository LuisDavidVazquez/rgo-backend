import { forwardRef, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { SimsModule } from 'src/sims/sims.module';
import { FiscalDetail } from 'src/fiscal_details/entities/fiscal_detail.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { UsersModule } from 'src/users/users.module';
import { ActionLog } from 'src/action_logs/entities/action_log.entity';
import { HttpModule } from '@nestjs/axios';
import { ActionLogsModule } from 'src/action_logs/action_logs.module';
import { ClientIccidsModule } from 'src/client_iccids/client_iccids.module'
import { AddressesModule } from 'src/addresses/addresses.module';
import { FiscalDetailsModule } from 'src/fiscal_details/fiscal_details.module';
import { MailService } from 'src/Mail.service';
import { MailModule } from 'src/Mail.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([Client, FiscalDetail, Address]),
    forwardRef(() => UsersModule),// Usa forwardRef para evitar dependencias circulares
    ActionLogsModule,// Asegúrate de que action_logs esté correctamente configurado
    HttpModule,// Incluye HttpModule si es necesario para tus servicios
    forwardRef(() => ClientIccidsModule),// Usa forwardRef para evitar dependencias circulares
    AddressesModule,
    FiscalDetailsModule,
    MailModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [ClientsController],
  providers: [ClientsService,MailService],
  exports: [ClientsService, TypeOrmModule.forFeature([Client])]

})
export class ClientsModule {}
