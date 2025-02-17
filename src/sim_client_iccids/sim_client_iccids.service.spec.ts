import { Test, TestingModule } from '@nestjs/testing';
import { SimClientIccidsService } from './sim_client_iccids.service';

describe('SimClientIccidsService', () => {
  let service: SimClientIccidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimClientIccidsService],
    }).compile();

    service = module.get<SimClientIccidsService>(SimClientIccidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
