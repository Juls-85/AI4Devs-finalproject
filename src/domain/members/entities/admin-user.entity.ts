import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  admin_id!: string;

  @Column({ type: 'uuid', unique: true })
  member_id!: string;

  @ManyToOne(() => Member, (member) => member.admin_users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member!: Member;

  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status!: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
