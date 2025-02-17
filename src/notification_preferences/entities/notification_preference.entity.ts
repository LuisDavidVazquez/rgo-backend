import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  notificationType: string;

  @Column({ type: 'boolean', default: false })
  email: boolean;

  @Column({ type: 'boolean', default: false })
  sms: boolean;

  @Column({ type: 'boolean', default: true })
  portal: boolean;

  @Column({ nullable: true })
  emailAddress: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  read: boolean;

  //@ManyToOne(() => User, user => user.notificationPreferences)
  //@JoinColumn({ name: 'userId' })
  //user: User;
}
