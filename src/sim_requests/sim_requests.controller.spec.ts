import { Test, TestingModule } from '@nestjs/testing';
import { SimRequestsController } from './sim_requests.controller';
import { SimRequestsService } from './sim_requests.service';

describe('SimRequestsController', () => {
  let controller: SimRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimRequestsController],
      providers: [SimRequestsService],
    }).compile();

    controller = module.get<SimRequestsController>(SimRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
