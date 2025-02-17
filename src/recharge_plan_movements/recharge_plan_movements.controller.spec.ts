import { Test, TestingModule } from '@nestjs/testing';
import { RechargePlanMovementsController } from './recharge_plan_movements.controller';
import { RechargePlanMovementsService } from './recharge_plan_movements.service';

describe('RechargePlanMovementsController', () => {
  let controller: RechargePlanMovementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RechargePlanMovementsController],
      providers: [RechargePlanMovementsService],
    }).compile();

    controller = module.get<RechargePlanMovementsController>(RechargePlanMovementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
