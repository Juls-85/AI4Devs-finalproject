import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Member } from '@domain/members/entities/member.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';

@Entity('audit_logs')
@Check(`"actor_member_id" IS NOT NULL OR "actor_admin_id" IS NOT NULL`)
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  audit_id!: string;

  @Column({ type: 'uuid', nullable: true })
  actor_member_id?: string;

  @ManyToOne(() => Member, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'actor_member_id' })
  member_actor?: Member;

  @Column({ type: 'uuid', nullable: true })
  actor_admin_id?: string;

  @ManyToOne(() => AdminUser, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'actor_admin_id' })
  admin_actor?: AdminUser;

  @Column({ type: 'varchar', length: 255 })
  entity_type!: string;

  @Column({ type: 'uuid' })
  entity_id!: string;

  @Column({ type: 'varchar', length: 100 })
  action!: 'CREATE' | 'UPDATE' | 'DELETE' | 'PAYMENT' | 'SEND_EMAIL' | string;

  @Column({ type: 'jsonb', nullable: true })
  payload?: object;

  @CreateDateColumn()
  created_at!: Date;
}
