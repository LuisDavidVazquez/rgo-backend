import { ClientIccid } from 'src/client_iccids/entities/client_iccid.entity';
import { RechargePlan } from 'src/recharge_plans/entities/recharge_plan.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { PrimaryColumn } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { RechargePlanMovement } from 'src/recharge_plan_movements/entities/recharge_plan_movement.entity';
import { SimClientIccid } from 'src/sim_client_iccids/entities/sim_client_iccid.entity';

@Entity('sims')
export class Sim {

  @PrimaryColumn()
  id: number;

  @Column()
  companyClient: number;

  @Column({ type: 'integer', nullable: true })
  // Cambiado a nullable: true
  statusId: number;// id interno de quassar

  @Column()
  status: string;

  @Column({ type: 'varchar', length: 255 })
  clientName: string;///nombres del distribuidor

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string; //nombre del ususario final

  @Column({ type: 'integer', nullable: true })
  days?: number;

  @Column({ type: 'timestamp', nullable: true })
  paidDate?: Date; // Cambiado a Date //fecha en que se pago el sim

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date; // Cambiado a Date // fecha vencimiento del sim

  @Column({ type: 'integer', nullable: true })
  rechargePlanId?: number;



  @Column({ type: 'varchar', length: 255, nullable: true })
  planName?: string; // este lo asigno yo

  @Column({ type: 'varchar', length: 20, nullable: true })
  iccid?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  imsi?: string;

  @Column({ type: 'varchar', length: 16 })
  msisdn: string;

  @Column({ type: 'timestamp', nullable: true })
  activationDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastStatusUpdate?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;


  @ManyToOne(() => RechargePlan, rechargePlan => rechargePlan.sims)
  @JoinColumn({ name: 'rechargePlanId' }) // Asegúrate de que el nombre del campo coincida con tu columna FK
  rechargePlan: RechargePlan;

  //  @OneToMany(() => ClienteIccid, clienteIccid => clienteIccid.sim)
  //  clienteIccids: ClienteIccid[];

  @Column({ type: 'integer', nullable: true })
  clientId?: number; // Asegúrate de que esta columna esté definida

  @Column({ default: false })
  isFirstPost: boolean;

  // @ManyToMany(() => ClientIccid, clientIccid => clientIccid.sims)
  //  @JoinTable({
  //    name: 'sim_client_iccids',
  // joinColumn: { name: 'sim_id', referencedColumnName: 'id' },
  //  inverseJoinColumn: { name: 'client_iccid_id', referencedColumnName: 'id' }
  //})
  // clientIccids: ClientIccid[];

  //  @OneToMany(() => RechargePlansMovement, movement => movement.sim)
  //movements: RechargePlansMovement[];


  @OneToMany(() => ClientIccid, clientIccid => clientIccid.sims)
  clientIccids: ClientIccid[];


  @OneToMany(() => RechargePlanMovement, movement => movement.sim)
  rechargePlanMovements: RechargePlanMovement[];

  // @ManyToOne(() => ClientesRastreoGo, client => client.sims)
  // @JoinColumn({ name: 'clientId' })
  // client: ClientesRastreoGo;

  @ManyToOne(() => Client, client => client.sims)
  @JoinColumn({ name: 'clientId' })
  client?: Client;

  @OneToMany(() => SimClientIccid, simClientIccid => simClientIccid.sim)
  simClientIccids: SimClientIccid[];





}
