import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    state: string;

    @Column({ type: 'varchar', length: 255 })
    street: string;

    @Column({ type: 'integer' })
    postalCode: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    number?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    neighborhood?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    city?: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: 'México' })
    country?: string;

    @Column({ type: 'integer', nullable: true })
    clientId?: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    innerNumber?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    externalNumber?: string;

    @Column({ type: 'boolean', default: true })
    isFiscalData: boolean;

    @ManyToOne(() => Client, client => client.addresses)
    @JoinColumn({ name: 'clientId' })
    client?: Client;
}
