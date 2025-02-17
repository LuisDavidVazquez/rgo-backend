import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 500 })
    token: string;

    @CreateDateColumn({ type: 'timestamp', name: 'obtainedAt', default: () => 'CURRENT_TIMESTAMP' })
    obtainedAt: Date;

    @CreateDateColumn({ type: 'timestamp', name: 'createdAt', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updatedAt', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', name: 'expiresAt', nullable: true })
    expiresAt?: Date;
}
