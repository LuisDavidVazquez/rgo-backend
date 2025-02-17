import { PartialType } from '@nestjs/swagger';
import { CreateSimClientIccidDto } from './create-sim_client_iccid.dto';

export class UpdateSimClientIccidDto extends PartialType(CreateSimClientIccidDto) {}
