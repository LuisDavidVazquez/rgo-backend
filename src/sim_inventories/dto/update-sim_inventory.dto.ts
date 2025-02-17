import { PartialType } from '@nestjs/swagger';
import { CreateSimInventoryDto } from './create-sim_inventory.dto';

export class UpdateSimInventoryDto extends PartialType(CreateSimInventoryDto) {}
