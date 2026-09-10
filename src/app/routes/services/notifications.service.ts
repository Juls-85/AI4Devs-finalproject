import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationRecipient } from '@domain/routes/entities';
import { Member } from '@domain/members/entities/member.entity';
import { CreateNotificationDto } from '../dtos';
import { AuditService } from './audit.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationRecipient)
    private notificationRecipientRepository: Repository<NotificationRecipient>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private auditService: AuditService,
  ) {}

  async createAndSendNotification(
    createNotificationDto: CreateNotificationDto,
    adminId: string,
  ): Promise<any> {
    const notification = this.notificationRepository.create({
      title: createNotificationDto.title,
      body: createNotificationDto.body,
      type: createNotificationDto.type || 'GENERAL',
      route_id: createNotificationDto.route_id,
      created_by: adminId,
      status: 'SENT',
      sent_at: new Date(),
    });

    const savedNotification = await this.notificationRepository.save(notification);

    const allMembers = await this.memberRepository.find({
      where: { status: 'ACTIVE' },
    });

    if (allMembers.length === 0) {
      throw new BadRequestException('No hay socios activos para enviar notificaciones');
    }

    const recipients = allMembers.map((member) =>
      this.notificationRecipientRepository.create({
        notification_id: savedNotification.notification_id,
        member_id: member.member_id,
        delivery_status: 'SENT',
        delivered_at: new Date(),
      }),
    );

    await this.notificationRecipientRepository.save(recipients);

    await this.auditService.logAction(
      'NOTIFICATION',
      savedNotification.notification_id,
      'SEND_EMAIL',
      {
        title: createNotificationDto.title,
        recipientCount: allMembers.length,
      },
      adminId,
    );

    return {
      notification_id: savedNotification.notification_id,
      title: savedNotification.title,
      body: savedNotification.body,
      type: savedNotification.type,
      status: savedNotification.status,
      sent_at: savedNotification.sent_at,
      recipientCount: allMembers.length,
    };
  }

  async getNotificationHistory(): Promise<any[]> {
    const notifications = await this.notificationRepository.find({
      where: { status: 'SENT' },
      order: { sent_at: 'DESC' },
    });

    return Promise.all(
      notifications.map(async (notification) => {
        const recipientCount = await this.notificationRecipientRepository.count({
          where: { notification_id: notification.notification_id },
        });

        return {
          notification_id: notification.notification_id,
          title: notification.title,
          body: notification.body,
          type: notification.type,
          status: notification.status,
          sent_at: notification.sent_at,
          recipientCount,
        };
      }),
    );
  }
}
