import { Module } from '@nestjs/common';
import { ClientRegistrationRequestsService } from './client_registration_requests.service';
import { ClientRegistrationRequestsController } from './client_registration_requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRegistrationRequest } from './entities/client_registration_request.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRegistrationRequest]), HttpModule],
  controllers: [ClientRegistrationRequestsController],
  providers: [ClientRegistrationRequestsService],
  exports: [ClientRegistrationRequestsService],
})
export class ClientRegistrationRequestsModule {}
