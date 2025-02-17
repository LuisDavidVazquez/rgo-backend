import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('client_registration_requests')
export class ClientRegistrationRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    personType: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    rfc?: string;

    @Column({ type: 'varchar', length: 255 })
    state: string;

    @Column({ type: 'varchar', length: 255 })
    city: string;

    @Column({ type: 'varchar', length: 255 })
    street: string;

    @Column({ type: 'varchar', length: 5 })
    postalCode: string;

//    @Column({ type: 'integer', nullable: true }) eliminar en una migracion
//    clientId?: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    neighborhood?: string;

    @CreateDateColumn({ type: 'timestamp' })
    requestDate: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    requestStatus?: string;

//    @ManyToOne(() => Client, client => client.registrationRequests, { nullable: true })
//    @JoinColumn({ name: 'clientId' })
//    client?: Client; eliminar en una migracion
}
