import { Test, TestingModule } from '@nestjs/testing';
import { ClientRegistrationRequestsController } from './client_registration_requests.controller';
import { ClientRegistrationRequestsService } from './client_registration_requests.service';

describe('ClientRegistrationRequestsController', () => {
  let controller: ClientRegistrationRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientRegistrationRequestsController],
      providers: [ClientRegistrationRequestsService],
    }).compile();

    controller = module.get<ClientRegistrationRequestsController>(ClientRegistrationRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
