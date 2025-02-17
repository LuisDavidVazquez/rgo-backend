import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { PagoDeClientesModule } from './pago_de_clientes/pago_de_clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { AuthModule } from 'permission-guard';
//import { UsuariosRastreoGo } from './usuarios_rastreo_go/entities/usuarios_rastreo_go.entity';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from 'db/data-source';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
//import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';
import { SimsModule } from './sims/sims.module';
//import { RechargePlanModule } from './recharge-plan/recharge-plan.module';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
// import { NotificationsPreferenceModule } from './notifications-preference/notifications-preference.module';
import { StripeModule } from './stripe/stripe.module';
import { APP_FILTER } from '@nestjs/core';
import { QueryFailedFilter } from './query-failed.filter';
import { ClientsModule } from './clients/clients.module';
import { ClientIccidsModule } from './client_iccids/client_iccids.module';
import { AddressesModule } from './addresses/addresses.module';
import { ActionLogsModule } from './action_logs/action_logs.module';
import { CommissionsModule } from './commissions/commissions.module';
import { FiscalDetailsModule } from './fiscal_details/fiscal_details.module';
import { NotificationPreferencesModule } from './notification_preferences/notification_preferences.module';
import { RechargePlanMovementsModule } from './recharge_plan_movements/recharge_plan_movements.module';
import { RechargePlansModule } from './recharge_plans/recharge_plans.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserRolesModule } from './user_roles/user_roles.module';
import { RolesModule } from './roles/roles.module';
import { ClientRegistrationRequestsModule } from './client_registration_requests/client_registration_requests.module';
import { SimClientIccidsModule } from './sim_client_iccids/sim_client_iccids.module';
import { SimInventoriesModule } from './sim_inventories/sim_inventories.module';
import { SimRequestsModule } from './sim_requests/sim_requests.module';
import { TokensModule } from './tokens/tokens.module';
import { CommissionReportsModule } from './commission_reports/commission_reports.module';
import { MailModule } from './Mail.module';

@Module({
  //imports: [PagoDeClientesModule, ComisionesModule, ReportsModule],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que ConfigModule esté disponible en toda la aplicación
      envFilePath: ['.env','.env.dev'],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    SimsModule,
    TerminusModule,
    HealthModule,
    NotificationsModule,
    NotificationPreferencesModule,
    StripeModule,
    ClientsModule,
    ClientIccidsModule,
    AddressesModule,
    ActionLogsModule,
    CommissionsModule,
    FiscalDetailsModule,
    NotificationPreferencesModule,
    RechargePlanMovementsModule,
    RechargePlansModule,
    PermissionsModule,
    UserRolesModule,
    RolesModule,
    ClientRegistrationRequestsModule,
    SimClientIccidsModule,
    SimInventoriesModule,
    SimRequestsModule,
    TokensModule,
    CommissionReportsModule,
    MailModule,
    // RechargePlanModule,
    // AuthModule,
    // UsersModule,
  ],

  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: QueryFailedFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
