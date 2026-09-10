import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Member } from './member.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  role_id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  role_name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Member, (member) => member.role)
  members!: Member[];
}
