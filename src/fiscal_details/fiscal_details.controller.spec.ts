import { Test, TestingModule } from '@nestjs/testing';
import { FiscalDetailsController } from './fiscal_details.controller';
import { FiscalDetailsService } from './fiscal_details.service';

describe('FiscalDetailsController', () => {
  let controller: FiscalDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscalDetailsController],
      providers: [FiscalDetailsService],
    }).compile();

    controller = module.get<FiscalDetailsController>(FiscalDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
