import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Route } from './route.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';

@Entity('route_media')
export class RouteMedia {
  @PrimaryGeneratedColumn('uuid')
  media_id!: string;

  @Column({ type: 'uuid' })
  route_id!: string;

  @ManyToOne(() => Route, (route) => route.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route!: Route;

  @Column({ type: 'varchar', length: 20 })
  media_type!: 'IMAGE' | 'VIDEO';

  @Column({ type: 'varchar', length: 500 })
  file_url!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cloud_key?: string;

  @Column({ type: 'text', nullable: true })
  caption?: string;

  @Column({ type: 'boolean', default: false })
  is_cover!: boolean;

  @Column({ type: 'uuid', nullable: true })
  uploaded_by?: string;

  @ManyToOne(() => AdminUser, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploader?: AdminUser;

  @CreateDateColumn()
  created_at!: Date;
}
