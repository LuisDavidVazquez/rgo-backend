import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationPreferencesService } from './notification_preferences.service';
import { CreateNotificationPreferenceDto } from './dto/create-notification_preference.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification_preference.dto';

@Controller('notification-preferences')
export class NotificationPreferencesController {
  constructor(private readonly notificationPreferencesService: NotificationPreferencesService) {}

  @Post()
  create(@Body() createNotificationPreferenceDto: CreateNotificationPreferenceDto) {
    return this.notificationPreferencesService.create(createNotificationPreferenceDto);
  }

  @Get()
  findAll() {
    return this.notificationPreferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationPreferencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationPreferenceDto: UpdateNotificationPreferenceDto) {
    return this.notificationPreferencesService.update(+id, updateNotificationPreferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationPreferencesService.remove(+id);
  }
}
