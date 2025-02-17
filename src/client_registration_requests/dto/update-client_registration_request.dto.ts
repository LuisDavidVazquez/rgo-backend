import { PartialType } from '@nestjs/swagger';
import { CreateClientRegistrationRequestDto } from './create-client_registration_request.dto';

export class UpdateClientRegistrationRequestDto extends PartialType(CreateClientRegistrationRequestDto) {}
