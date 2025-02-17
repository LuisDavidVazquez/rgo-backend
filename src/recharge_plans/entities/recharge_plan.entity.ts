import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RechargePlanMovement } from '../../recharge_plan_movements/entities/recharge_plan_movement.entity';
import { Sim } from 'src/sims/entities/sim.entity';

@Entity('recharge_plans')
export class RechargePlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    amount: number;

    @Column({ type: 'integer' })
    days: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name?: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => Sim, sim => sim.rechargePlan)
    sims: Sim[];


    @OneToMany(() => RechargePlanMovement, rechargePlanMovement => rechargePlanMovement.rechargePlan)
    rechargePlanMovements: RechargePlanMovement[];
}
