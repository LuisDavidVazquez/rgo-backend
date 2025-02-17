import { Test, TestingModule } from '@nestjs/testing';
import { ClientRegistrationRequestsService } from './client_registration_requests.service';

describe('ClientRegistrationRequestsService', () => {
  let service: ClientRegistrationRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientRegistrationRequestsService],
    }).compile();

    service = module.get<ClientRegistrationRequestsService>(ClientRegistrationRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
