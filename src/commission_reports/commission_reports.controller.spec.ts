import { Test, TestingModule } from '@nestjs/testing';
import { CommissionReportsController } from './commission_reports.controller';
import { CommissionReportsService } from './commission_reports.service';

describe('CommissionReportsController', () => {
  let controller: CommissionReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommissionReportsController],
      providers: [CommissionReportsService],
    }).compile();

    controller = module.get<CommissionReportsController>(CommissionReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
