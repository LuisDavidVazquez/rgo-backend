import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Sim } from '../../sims/entities/sim.entity';
import { ClientIccid } from '../../client_iccids/entities/client_iccid.entity';

@Entity('sim_client_iccids')
export class SimClientIccid {
    @PrimaryColumn({ name: 'clientIccidId', type: 'integer' })
    clientIccidId: number;

    @PrimaryColumn({ name: 'simId', type: 'integer' })
    simId: number;

//    @ManyToOne(() => Sim, sim => sim.clientIccids)
//    @JoinColumn({ name: 'simId' })
//    sim: Sim;

 //  @ManyToOne(() => ClientIccid, clientIccid => clientIccid.sims)
 //  @JoinColumn({ name: 'clientIccidId' })
 //  clientIccid: ClientIccid;

 @ManyToOne(() => Sim, sim => sim.simClientIccids)
 @JoinColumn({ name: 'simId' })
 sim: Sim;

 @ManyToOne(() => ClientIccid, clientIccid => clientIccid.simClientIccids)
 @JoinColumn({ name: 'clientIccidId' })
 clientIccid: ClientIccid;
}

