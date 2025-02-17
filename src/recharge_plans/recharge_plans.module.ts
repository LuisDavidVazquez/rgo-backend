import { forwardRef, Module } from '@nestjs/common';
import { RechargePlansService } from './recharge_plans.service';
import { RechargePlansController } from './recharge_plans.controller';
import { RechargePlan } from './entities/recharge_plan.entity';
import { RechargePlanMovement } from 'src/recharge_plan_movements/entities/recharge_plan_movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargePlanMovementsModule } from 'src/recharge_plan_movements/recharge_plan_movements.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RechargePlan, RechargePlanMovement]),
    forwardRef(() => RechargePlanMovementsModule),
    forwardRef(() => AuthModule),
  ],

  controllers: [RechargePlansController],
  providers: [RechargePlansService],
  exports: [
    RechargePlansService, 
    TypeOrmModule, // Exporta TypeOrmModule si otros módulos necesitan acceder a los repositorios
  ],
})
export class RechargePlansModule {}
