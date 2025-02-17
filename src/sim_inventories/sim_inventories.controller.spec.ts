import { Test, TestingModule } from '@nestjs/testing';
import { SimInventoriesController } from './sim_inventories.controller';
import { SimInventoriesService } from './sim_inventories.service';

describe('SimInventoriesController', () => {
  let controller: SimInventoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimInventoriesController],
      providers: [SimInventoriesService],
    }).compile();

    controller = module.get<SimInventoriesController>(SimInventoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
