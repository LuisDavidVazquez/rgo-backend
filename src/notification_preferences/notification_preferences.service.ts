import { Injectable } from '@nestjs/common';
import { CreateNotificationPreferenceDto } from './dto/create-notification_preference.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification_preference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreference } from './entities/notification_preference.entity';

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @InjectRepository(NotificationPreference)
    private notificationPreferencesRepository: Repository<NotificationPreference>,
  ) {}

  create(createNotificationPreferenceDto: CreateNotificationPreferenceDto) {
    return 'This action adds a new notificationPreference';
  }

  findAll() {
    return `This action returns all notificationPreferences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificationPreference`;
  }

  update(
    id: number,
    updateNotificationPreferenceDto: UpdateNotificationPreferenceDto,
  ) {
    return `This action updates a #${id} notificationPreference`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificationPreference`;
  }

  findByUserId(userId: number) {
    return this.notificationPreferencesRepository.find({ where: { userId } });
  }
}
