import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { UserRole } from '../../user_roles/entities/user_role.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'integer' })
    permissionId: number;

    @ManyToOne(() => Permission, permission => permission.role, { nullable: false })
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];

   // @CreateDateColumn({ type: 'timestamp' })
   // createdAt: Date;

  //  @UpdateDateColumn({ type: 'timestamp' })
  //  updatedAt: Date;
}

