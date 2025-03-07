import { Address } from 'src/addresses/entities/address.entity';
import { ClientIccid } from 'src/client_iccids/entities/client_iccid.entity';
import { Commission } from 'src/commissions/entities/commission.entity';
import { FiscalDetail } from 'src/fiscal_details/entities/fiscal_detail.entity';
import { RechargePlanMovement } from 'src/recharge_plan_movements/entities/recharge_plan_movement.entity';
import { Sim } from 'src/sims/entities/sim.entity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    clientLevel?: string;

    @Column({ type: 'varchar', length: 255 })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    password?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    permission?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    externalId?: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'integer', nullable: true })
    externalPlatformId?: number;

    @OneToMany(() => ClientIccid, clientIccid => clientIccid.client)
    clientIccids: ClientIccid[];

    

    @OneToMany(() => Address, address => address.client)
    addresses: Address[];

    @OneToMany(() => FiscalDetail, fiscalDetail => fiscalDetail.client)
    fiscalDetails: FiscalDetail[];

    @OneToMany(() => User, user => user.client)
    users: User[];

    @OneToMany(() => Sim, sim => sim.client)
    sims: Sim[];

    @OneToMany(() => UserRole, userRole => userRole.client)
    userRoles: UserRole[];

    @OneToMany(() => RechargePlanMovement, rechargePlanMovement => rechargePlanMovement.client)
    rechargePlanMovements: RechargePlanMovement[];


}
