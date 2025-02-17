import { Test, TestingModule } from '@nestjs/testing';
import { SimsController } from './sims.controller';
import { SimsService } from './sims.service';

describe('SimsController', () => {
  let controller: SimsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimsController],
      providers: [SimsService],
    }).compile();

    controller = module.get<SimsController>(SimsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
