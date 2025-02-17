import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('fiscal_details')
export class FiscalDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    personType: string;

    @Column({ type: 'varchar', length: 255 })
    rfc: string;

    @Column({ type: 'integer', nullable: true })
    clientId?: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    businessName?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fiscalRegime?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cdfiUsage?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    paymentMethod?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    paymentForm?: string;

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'MXN' })
    paymentCurrency?: string;

    @ManyToOne(() => Client, client => client.fiscalDetails)
    client?: Client;
}
