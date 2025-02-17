import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Commission } from '../../commissions/entities/commission.entity';

@Entity('commission_reports')
export class CommissionReport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    commissionId: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => Commission, commission => commission.commissionReportId, { nullable: false })
    @JoinColumn({ name: 'commissionId' })
    commission: Commission;
}
