import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Route } from './route.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { NotificationRecipient } from './notification-recipient.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notification_id!: string;

  @Column({ type: 'uuid', nullable: true })
  route_id?: string;

  @ManyToOne(() => Route, (route) => route.notifications, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'route_id' })
  route?: Route;

  @Column({ type: 'uuid' })
  created_by!: string;

  @ManyToOne(() => AdminUser, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator!: AdminUser;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: 'ROUTE' | 'GENERAL' | 'REMINDER';

  @Column({ type: 'varchar', length: 50, default: 'DRAFT' })
  status!: 'DRAFT' | 'SENT' | 'FAILED';

  @Column({ type: 'timestamp', nullable: true })
  scheduled_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  sent_at?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => NotificationRecipient, (recipient) => recipient.notification)
  recipients!: NotificationRecipient[];
}
