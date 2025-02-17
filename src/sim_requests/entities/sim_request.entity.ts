import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('sim_requests')
export class SimRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    clientId: number;

    @Column({ type: 'varchar', length: 255 })
    street: string;

    @Column({ type: 'varchar', length: 255 })
    neighborhood: string;

    @Column({ type: 'varchar', length: 5 })
    postalCode: string;

    @Column({ type: 'varchar', length: 255 })
    state: string;

    @Column({ type: 'varchar', length: 255 })
    city: string;

    @Column({ type: 'integer' })
    requestedSimsQuantity: number;

    @CreateDateColumn({ type: 'timestamp' })
    requestDate: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string; //nombre del usuario final

    @Column({ type: 'varchar', length: 255, nullable: true })
    requestStatus?: string;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'clientId' })
    client: Client;
}
