import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Member } from '@domain/members/entities/member.entity';
import { Route } from './route.entity';

@Entity('payments')
@Unique(['provider', 'provider_payment_id'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  payment_id!: string;

  @Column({ type: 'uuid' })
  member_id!: string;

  @ManyToOne(() => Member, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'member_id' })
  member!: Member;

  @Column({ type: 'uuid' })
  route_id!: string;

  @ManyToOne(() => Route, (route) => route.payments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'route_id' })
  route!: Route;

  @Column({ type: 'uuid', nullable: true })
  registration_id?: string;

  @Column({ type: 'varchar', length: 50 })
  provider!: 'STRIPE' | 'PAYPAL' | 'MANUAL';

  @Column({ type: 'varchar', length: 255 })
  provider_payment_id!: string;

  @Column({ type: 'varchar', length: 50 })
  status!: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 3, default: 'EUR' })
  currency!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  @Column({ type: 'jsonb', nullable: true })
  provider_payload?: object;
}
