import { forwardRef, Module } from '@nestjs/common';
import { RechargePlanMovementsService } from './recharge_plan_movements.service';
import { RechargePlanMovementsController } from './recharge_plan_movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargePlanMovement } from './entities/recharge_plan_movement.entity';
import { Sim } from 'src/sims/entities/sim.entity';
import { RechargePlan } from 'src/recharge_plans/entities/recharge_plan.entity';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { RechargePlansModule } from 'src/recharge_plans/recharge_plans.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RechargePlanMovement,
      Sim,
      User,
      RechargePlan,
      Client,
    ]),
    StripeModule,
    forwardRef(() => RechargePlansModule),
    PermissionsModule,
  ],
  controllers: [RechargePlanMovementsController],
  providers: [RechargePlanMovementsService],
  exports: [RechargePlanMovementsService],
})
export class RechargePlanMovementsModule {}
