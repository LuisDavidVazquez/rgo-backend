import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Sim } from '../../sims/entities/sim.entity';
import { User } from '../../users/entities/user.entity';
import { RechargePlan } from '../../recharge_plans/entities/recharge_plan.entity';
import { Client } from 'src/clients/entities/client.entity';

@Entity('recharge_plan_movements')
export class RechargePlanMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'integer' })
  simId: number;

  @Column({ type: 'integer', nullable: true })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  planName: string;

  @Column({ type: 'integer', nullable: true })
  rechargePlanId?: number;

  @Column({ type: 'varchar', length: 255 })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 255 })
  transactionNumber: string;

  @Column({ type: 'varchar', length: 255 })
  paymentId: string;

  @Column({ type: 'boolean', default: false })
  isFirstPost: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripePaymentIntentId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeCustomerId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientSecret?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethodId?: string;

  @Column({ type: 'varchar', length: 10, default: 'mxn' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  paymentMetadata?: any;

  @Column({ type: 'boolean', default: false })
  refunded: boolean;

  @Column({ type: 'varchar', length: 255, default: 'STRIPE' })
  paymentProvider: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userType: string;


  @ManyToOne(() => Sim, (sim) => sim.rechargePlanMovements)
  @JoinColumn({ name: 'simId' })
  sim: Sim;

  // Relaciones existentes
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => RechargePlan, { nullable: true })
  @JoinColumn({ name: 'rechargePlanId' })
  rechargePlan?: RechargePlan;

  //    @OneToMany(() => Comission, comission => comission.rechargePlanMovements)
  //   comissions: Comission[];

  @Column({ type: 'integer', nullable: true })
  clientId?: number;

  @ManyToOne(() => Client, { nullable: true })
  @JoinColumn({ name: 'clientId' })
  client?: Client;
}
