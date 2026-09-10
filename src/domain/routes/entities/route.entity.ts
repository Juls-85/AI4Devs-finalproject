import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { Member } from '@domain/members/entities/member.entity';
import { RouteMedia } from './route-media.entity';
import { CalendarEvent } from './calendar-event.entity';
import { Payment } from './payment.entity';
import { Notification } from './notification.entity';

@Entity('routes')
@Check(`"created_by_member" IS NOT NULL OR "created_by_admin" IS NOT NULL`)
@Check(`"status" IN ('PROPOSAL', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'COMPLETED', 'CANCELLED')`)
export class Route {
  @PrimaryGeneratedColumn('uuid')
  route_id!: string;

  @Column({ type: 'uuid', nullable: true })
  created_by_member?: string;

  @ManyToOne(() => Member, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_member' })
  member_creator?: Member;

  @Column({ type: 'uuid', nullable: true })
  created_by_admin?: string;

  @ManyToOne(() => AdminUser, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by_admin' })
  admin_creator?: AdminUser;

  @Column({ type: 'varchar', length: 20 })
  created_by_type!: 'MEMBER' | 'ADMIN';

  @Column({ type: 'uuid', nullable: true })
  reviewed_by?: string;

  @ManyToOne(() => AdminUser, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer?: AdminUser;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance_km?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  meeting_point?: string;

  @Column({ type: 'varchar', length: 50 })
  status!: 'PROPOSAL' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

  @Column({ type: 'date', nullable: true })
  departure_date?: Date;

  @Column({ type: 'time', nullable: true })
  departure_time?: string;

  @Column({ type: 'date', nullable: true })
  return_date?: Date;

  @Column({ type: 'boolean', default: false })
  has_lodging!: boolean;

  @Column({ type: 'boolean', default: false })
  has_restaurant!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  base_price?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lodging_price?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  restaurant_price?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_price?: number;

  @Column({ type: 'jsonb', nullable: true })
  route_data?: object;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => RouteMedia, (media) => media.route)
  media!: RouteMedia[];

  @OneToMany(() => CalendarEvent, (event) => event.route)
  calendar_events!: CalendarEvent[];

  @OneToMany(() => Payment, (payment) => payment.route)
  payments!: Payment[];

  @OneToMany(() => Notification, (notification) => notification.route)
  notifications!: Notification[];
}
