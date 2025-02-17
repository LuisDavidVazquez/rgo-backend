import { Test, TestingModule } from '@nestjs/testing';
import { ClientIccidsController } from './client_iccids.controller';
import { ClientIccidsService } from './client_iccids.service';

describe('ClientIccidsController', () => {
  let controller: ClientIccidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientIccidsController],
      providers: [ClientIccidsService],
    }).compile();

    controller = module.get<ClientIccidsController>(ClientIccidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
