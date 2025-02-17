import { PartialType } from '@nestjs/swagger';
import { CreateClientIccidDto } from './create-client_iccid.dto';

export class UpdateClientIccidDto extends PartialType(CreateClientIccidDto) {}
