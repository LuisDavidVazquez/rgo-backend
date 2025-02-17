import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('commissions')
export class Commission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    companyClientId: number;

    @Column({ type: 'integer' })
    recharge: number;

    @Column({ type: 'integer' })
    commission: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'integer', nullable: true })
    commissionReportId?: number;

    @Column({ type: 'integer', nullable: true })
    rechargePlanMovementId?: number;

    @Column({ type: 'integer', nullable: true })
    activation?: number;

    
}
