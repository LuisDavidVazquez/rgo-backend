import { Test, TestingModule } from '@nestjs/testing';
import { SimRequestsService } from './sim_requests.service';

describe('SimRequestsService', () => {
  let service: SimRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimRequestsService],
    }).compile();

    service = module.get<SimRequestsService>(SimRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
