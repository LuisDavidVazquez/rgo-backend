import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { NotificationType } from '../Enum/notification-type.enum';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    clientId: number;
  
    @Column()
    message: string;
  
    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.GENERAL
    })
    type: NotificationType;
  
    @Column({ default: 'PENDING' })
    status: string;
  
    @Column({ nullable: true })
    iccid: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    readAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;
  
    @Column('json', { nullable: true })
    data: any;
}