import { PartialType } from '@nestjs/swagger';
import { CreateSimRequestDto } from './create-sim_request.dto';

export class UpdateSimRequestDto extends PartialType(CreateSimRequestDto) {}
