import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import { IsOptional, IsDate } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsOptional()
  @IsDate()
  readAt?: Date;
}
