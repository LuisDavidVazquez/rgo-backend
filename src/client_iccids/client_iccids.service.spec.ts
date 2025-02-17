import { Test, TestingModule } from '@nestjs/testing';
import { ClientIccidsService } from './client_iccids.service';

describe('ClientIccidsService', () => {
  let service: ClientIccidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientIccidsService],
    }).compile();

    service = module.get<ClientIccidsService>(ClientIccidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
