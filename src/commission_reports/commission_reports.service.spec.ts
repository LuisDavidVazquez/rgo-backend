import { Test, TestingModule } from '@nestjs/testing';
import { CommissionReportsService } from './commission_reports.service';

describe('CommissionReportsService', () => {
  let service: CommissionReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommissionReportsService],
    }).compile();

    service = module.get<CommissionReportsService>(CommissionReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
