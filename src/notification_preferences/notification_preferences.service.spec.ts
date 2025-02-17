import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPreferencesService } from './notification_preferences.service';

describe('NotificationPreferencesService', () => {
  let service: NotificationPreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationPreferencesService],
    }).compile();

    service = module.get<NotificationPreferencesService>(NotificationPreferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
