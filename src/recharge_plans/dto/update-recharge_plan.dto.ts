import { PartialType } from '@nestjs/swagger';
import { CreateRechargePlanDto } from './create-recharge_plan.dto';

export class UpdateRechargePlanDto extends PartialType(CreateRechargePlanDto) {}
