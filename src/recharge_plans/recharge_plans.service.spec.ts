import { Test, TestingModule } from '@nestjs/testing';
import { RechargePlansService } from './recharge_plans.service';

describe('RechargePlansService', () => {
  let service: RechargePlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RechargePlansService],
    }).compile();

    service = module.get<RechargePlansService>(RechargePlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
