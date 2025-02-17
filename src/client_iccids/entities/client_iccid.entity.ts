import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Sim } from 'src/sims/entities/sim.entity';
import { User } from 'src/users/entities/user.entity';
import { SimClientIccid } from 'src/sim_client_iccids/entities/sim_client_iccid.entity';


@Entity('client_iccids')
export class ClientIccid {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    iccid: string;

    @Column({ type: 'varchar', length: 255 })
    unitName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    imei: string;

    @Column({ type: 'varchar', length: 255 })
    gps: string;

    @Column({ type: 'integer' })
    userId: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'integer', nullable: true })
    simId?: number;

    @Column({ type: 'integer', nullable: true })
    clientId?: number;

    @ManyToOne(() => Client, client => client.clientIccids)
    @JoinColumn({ name: 'clientId' })
    client?: Client;

    @ManyToMany(() => Sim, sim => sim.clientIccids)
    @JoinTable({
        name: 'sim_client_iccids',
        joinColumn: { name: 'clientIccidId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'simId', referencedColumnName: 'id' }
    })
    sims: Sim[];


  @ManyToOne(() => User, user => user.clientIccids)
    user: User;



    @OneToMany(() => SimClientIccid, simClientIccid => simClientIccid.clientIccid)
    simClientIccids: SimClientIccid[];

    // @ManyToOne(() => User, user => user.clientIccids)
    //@JoinColumn({ name: 'userId' })
    //user: User;



  

    //@ManyToOne(() => Sim, sim => sim.clientIccids)
    //sim: Sim;


   // username: string;
}
