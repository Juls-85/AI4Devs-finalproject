import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Route,
  RouteMedia,
  CalendarEvent,
  Payment,
  Notification,
  NotificationRecipient,
  AuditLog,
} from '@domain/routes/entities';
import { Member } from '@domain/members/entities/member.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { RoutesService, NotificationsService, AuditService } from './services';
import { RoutesController } from './controllers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Route,
      RouteMedia,
      CalendarEvent,
      Payment,
      Notification,
      NotificationRecipient,
      AuditLog,
      Member,
      AdminUser,
    ]),
    JwtModule,
  ],
  controllers: [RoutesController],
  providers: [RoutesService, NotificationsService, AuditService],
  exports: [RoutesService, NotificationsService, AuditService],
})
export class RoutesModule {}
