import { Test, TestingModule } from '@nestjs/testing';
import { ActionLogsController } from './action_logs.controller';
import { ActionLogsService } from './action_logs.service';

describe('ActionLogsController', () => {
  let controller: ActionLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionLogsController],
      providers: [ActionLogsService],
    }).compile();

    controller = module.get<ActionLogsController>(ActionLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
