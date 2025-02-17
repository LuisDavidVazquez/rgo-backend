import { Test, TestingModule } from '@nestjs/testing';
import { SimInventoriesService } from './sim_inventories.service';

describe('SimInventoriesService', () => {
  let service: SimInventoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimInventoriesService],
    }).compile();

    service = module.get<SimInventoriesService>(SimInventoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
