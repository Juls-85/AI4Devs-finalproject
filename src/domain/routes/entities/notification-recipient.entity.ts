import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Notification } from './notification.entity';
import { Member } from '@domain/members/entities/member.entity';

@Entity('notification_recipients')
@Unique(['notification_id', 'member_id'])
export class NotificationRecipient {
  @PrimaryGeneratedColumn('uuid')
  notification_recipient_id!: string;

  @Column({ type: 'uuid' })
  notification_id!: string;

  @ManyToOne(() => Notification, (notification) => notification.recipients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notification_id' })
  notification!: Notification;

  @Column({ type: 'uuid' })
  member_id!: string;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member!: Member;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  delivery_status!: 'PENDING' | 'SENT' | 'OPENED' | 'FAILED';

  @Column({ type: 'timestamp', nullable: true })
  delivered_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  read_at?: Date;
}
