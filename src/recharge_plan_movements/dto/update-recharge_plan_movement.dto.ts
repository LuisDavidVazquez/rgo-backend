import { PartialType } from '@nestjs/swagger';
import { CreateRechargePlanMovementDto } from './create-recharge_plan_movement.dto';

export class UpdateRechargePlanMovementDto extends PartialType(CreateRechargePlanMovementDto) {}
