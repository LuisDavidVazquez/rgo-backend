import { Test, TestingModule } from '@nestjs/testing';
import { RechargePlanMovementsService } from './recharge_plan_movements.service';

describe('RechargePlanMovementsService', () => {
  let service: RechargePlanMovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RechargePlanMovementsService],
    }).compile();

    service = module.get<RechargePlanMovementsService>(RechargePlanMovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
