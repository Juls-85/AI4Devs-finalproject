import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Role, Member, AdminUser } from '@domain/members/entities';
import {
  Route,
  RouteMedia,
  CalendarEvent,
  Payment,
  Notification,
  NotificationRecipient,
  AuditLog,
} from '@domain/routes/entities';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'frapen_user',
  password: process.env.DB_PASSWORD || 'frapen_password_dev',
  database: process.env.DB_NAME || 'frapen_angels',
  entities: [
    Role,
    Member,
    AdminUser,
    Route,
    RouteMedia,
    CalendarEvent,
    Payment,
    Notification,
    NotificationRecipient,
    AuditLog,
  ],
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};
