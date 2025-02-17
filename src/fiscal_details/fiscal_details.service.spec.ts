import { Test, TestingModule } from '@nestjs/testing';
import { FiscalDetailsService } from './fiscal_details.service';

describe('FiscalDetailsService', () => {
  let service: FiscalDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FiscalDetailsService],
    }).compile();

    service = module.get<FiscalDetailsService>(FiscalDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
