import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPreferencesController } from './notification_preferences.controller';
import { NotificationPreferencesService } from './notification_preferences.service';

describe('NotificationPreferencesController', () => {
  let controller: NotificationPreferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationPreferencesController],
      providers: [NotificationPreferencesService],
    }).compile();

    controller = module.get<NotificationPreferencesController>(NotificationPreferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
