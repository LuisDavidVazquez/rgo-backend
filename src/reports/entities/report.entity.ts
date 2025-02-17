import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Reportcomisione {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idcomisione: number;

  @Column({ default: true }) //esto hace un registro que pordefault true espera registros
  IsActive: boolean;
}
