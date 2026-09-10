import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Route } from './route.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';

@Entity('calendar_events')
@Check(`"status" IN ('SCHEDULED', 'DONE', 'CANCELLED')`)
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  event_id!: string;

  @Column({ type: 'uuid', nullable: true })
  route_id?: string;

  @ManyToOne(() => Route, (route) => route.calendar_events, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'route_id' })
  route?: Route;

  @Column({ type: 'uuid' })
  created_by!: string;

  @ManyToOne(() => AdminUser, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator!: AdminUser;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  start_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_at?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 50, default: 'SCHEDULED' })
  status!: 'SCHEDULED' | 'DONE' | 'CANCELLED';

  @Column({ type: 'integer', nullable: true })
  capacity?: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
