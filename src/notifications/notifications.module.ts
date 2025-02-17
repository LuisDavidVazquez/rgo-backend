import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { SimsModule } from '../sims/sims.module';
import { NotificationPreferencesModule } from '../notification_preferences/notification_preferences.module';
import { MailService } from '../Mail.service';
import { SmsModule } from '../sms-notification/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    forwardRef(() => SimsModule),
    NotificationPreferencesModule, // Asegúrate de que esta línea esté presente
    SmsModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, MailService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
