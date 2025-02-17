import { Test, TestingModule } from '@nestjs/testing';
import { RechargePlansController } from './recharge_plans.controller';
import { RechargePlansService } from './recharge_plans.service';

describe('RechargePlansController', () => {
  let controller: RechargePlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RechargePlansController],
      providers: [RechargePlansService],
    }).compile();

    controller = module.get<RechargePlansController>(RechargePlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
