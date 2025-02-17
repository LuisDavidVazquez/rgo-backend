import { Test, TestingModule } from '@nestjs/testing';
import { SimClientIccidsController } from './sim_client_iccids.controller';
import { SimClientIccidsService } from './sim_client_iccids.service';

describe('SimClientIccidsController', () => {
  let controller: SimClientIccidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimClientIccidsController],
      providers: [SimClientIccidsService],
    }).compile();

    controller = module.get<SimClientIccidsController>(SimClientIccidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
