import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('action_logs')
export class ActionLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    action: string;

    @Column({ type: 'jsonb' })
    changes: any;

    @Column({ type: 'text' })
    description: string;

    @CreateDateColumn({ type: 'timestamp', precision: 6 })
    createdAt: Date;
}