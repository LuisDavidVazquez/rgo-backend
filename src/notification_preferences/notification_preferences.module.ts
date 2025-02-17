import { Module } from '@nestjs/common';
import { NotificationPreferencesService } from './notification_preferences.service';
import { NotificationPreferencesController } from './notification_preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPreference } from './entities/notification_preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationPreference])],
  controllers: [NotificationPreferencesController],
  providers: [NotificationPreferencesService],
  exports: [NotificationPreferencesService],
})
export class NotificationPreferencesModule {}
