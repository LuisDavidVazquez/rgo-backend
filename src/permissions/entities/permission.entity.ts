import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../user_roles/entities/user_role.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    value: string;

    @Column({ type: 'integer', nullable: true })
    roleId?: number;

  


    @ManyToOne(() => Role, role => role.permission, { eager: true })
    role: Role;
}
