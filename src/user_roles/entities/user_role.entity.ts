import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
@Entity('user_roles')
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', nullable: true })
    userId?: number;

    @Column({ type: 'integer', nullable: true })
    clientId?: number;

    @Column({ type: 'varchar', length: 255 })
    roleType: string;

    @Column({ type: 'integer' })
    roleId: number;

 //   @ManyToOne(() => User, user => user.userRoles, { nullable: true })
 //   @JoinColumn({ name: 'userId' })
 //   user?: User;

 //   @ManyToOne(() => Client, client => client.userRoles, { nullable: true })
 //   @JoinColumn({ name: 'clientId' })
 //   client?: Client;


    @ManyToOne(() => Role, role => role.userRoles)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @ManyToOne(() => User, user => user.userRoles)
    @JoinColumn({ name: 'userId' })
    user?: User;

    @ManyToOne(() => Client, client => client.userRoles)
    @JoinColumn({ name: 'clientId' })
    client?: Client
}
