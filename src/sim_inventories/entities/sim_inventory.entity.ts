import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sim_inventories')
export class SimInventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    companyClient: number;

    @Column({ type: 'integer' })
    statusId: number;// id interno de quassar

    @Column({ type: 'varchar', length: 255 })
    status: string;

    @Column({ type: 'varchar', length: 255 })
    client: string;//nombres del distribuidor

    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string;//nombre del ususario final

    @Column({ type: 'integer', nullable: true })
    days?: number;

    @Column({ type: 'timestamp', nullable: true })
    paidDate?: Date;// Cambiado a Date //fecha en que se pago el sim

    @Column({ type: 'timestamp', nullable: true })
    dueDate?: Date;// Cambiado a Date // fecha vencimiento del sim

    @Column({ type: 'integer', nullable: true })
    rechargePlanId?: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    planName?: string;

    @Column({ type: 'varchar', length: 20 })
    iccid: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    imsi?: string;

    @Column({ type: 'varchar', length: 16 })
    msisdn: string;

    @Column({ type: 'timestamp', nullable: true })
    activationDate?: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastStatusUpdate?: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @Column({ type: 'integer' })
    clientId: number;

    @Column({ type: 'boolean', default: false })
    isFirstPost: boolean;

 
}
