import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route, Notification, NotificationRecipient } from '@domain/routes/entities';
import { Member } from '@domain/members/entities/member.entity';
import { CreateRouteDto, UpdateRouteDto, RouteResponseDto, ReviewRouteProposalDto } from '../dtos';
import { AuditService } from './audit.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationRecipient)
    private notificationRecipientRepository: Repository<NotificationRecipient>,
    private auditService: AuditService,
  ) {}

  async createRoute(createRouteDto: CreateRouteDto, adminId: string): Promise<RouteResponseDto> {
    const routeData: any = {
      title: createRouteDto.title,
      description: createRouteDto.description,
      difficulty: createRouteDto.difficulty,
      distance_km: createRouteDto.distance_km,
      meeting_point: createRouteDto.meeting_point,
      departure_date: createRouteDto.departure_date,
      departure_time: createRouteDto.departure_time,
      return_date: createRouteDto.return_date,
      has_lodging: createRouteDto.has_lodging || false,
      has_restaurant: createRouteDto.has_restaurant || false,
      base_price: createRouteDto.base_price,
      lodging_price: createRouteDto.lodging_price,
      restaurant_price: createRouteDto.restaurant_price,
      total_price: createRouteDto.total_price,
      route_data: createRouteDto.route_data,
      created_by_admin: adminId,
      created_by_type: 'ADMIN',
      status: createRouteDto.status || 'PUBLISHED',
    };

    const route = this.routeRepository.create(routeData);
    const savedRoute = (await this.routeRepository.save(route)) as unknown as Route;

    await this.auditService.logAction(
      'ROUTE',
      savedRoute.route_id,
      'CREATE',
      createRouteDto,
      adminId,
    );

    return this.mapToRouteResponse(savedRoute);
  }

  async updateRoute(routeId: string, updateRouteDto: UpdateRouteDto, adminId: string): Promise<RouteResponseDto> {
    const route = await this.routeRepository.findOne({ where: { route_id: routeId } });

    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }

    Object.assign(route, updateRouteDto);
    const updatedRoute = await this.routeRepository.save(route);

    await this.auditService.logAction(
      'ROUTE',
      routeId,
      'UPDATE',
      updateRouteDto,
      adminId,
    );

    return this.mapToRouteResponse(updatedRoute);
  }

  async getRoute(routeId: string): Promise<RouteResponseDto> {
    const route = await this.routeRepository.findOne({ where: { route_id: routeId } });

    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }

    return this.mapToRouteResponse(route);
  }

  async listPendingProposals(): Promise<RouteResponseDto[]> {
    const routes = await this.routeRepository.find({
      where: { status: 'PENDING_REVIEW' },
      order: { created_at: 'ASC' },
    });

    return routes.map((route) => this.mapToRouteResponse(route));
  }

  async reviewProposal(
    routeId: string,
    reviewDto: ReviewRouteProposalDto,
    adminId: string,
  ): Promise<RouteResponseDto> {
    const route = await this.routeRepository.findOne({
      where: { route_id: routeId },
      relations: ['member_creator'],
    });

    if (!route) {
      throw new NotFoundException('Propuesta de ruta no encontrada');
    }

    if (route.status !== 'PENDING_REVIEW') {
      throw new BadRequestException('Esta propuesta no está pendiente de revisión');
    }

    route.status = reviewDto.status as any;
    route.reviewed_by = adminId;
    route.reviewed_at = new Date();

    const updatedRoute = await this.routeRepository.save(route);

    await this.auditService.logAction(
      'ROUTE',
      routeId,
      reviewDto.status === 'PUBLISHED' ? 'APPROVE_PROPOSAL' : 'REJECT_PROPOSAL',
      { status: reviewDto.status, reason: reviewDto.reason },
      adminId,
    );

    if (reviewDto.status === 'REJECTED' && route.created_by_member) {
      await this.notifyMember(
        route.created_by_member,
        `Tu propuesta de ruta ha sido rechazada. Motivo: ${reviewDto.reason || 'Sin especificar'}`,
        route.route_id,
        adminId,
      );
    }

    return this.mapToRouteResponse(updatedRoute);
  }

  private async notifyMember(
    memberId: string,
    message: string,
    routeId: string,
    adminId: string,
  ): Promise<void> {
    const notification = this.notificationRepository.create({
      title: 'Notificación de ruta',
      body: message,
      type: 'ROUTE',
      route_id: routeId,
      created_by: adminId,
      status: 'SENT',
      sent_at: new Date(),
    });

    const savedNotification = await this.notificationRepository.save(notification);

    const recipient = this.notificationRecipientRepository.create({
      notification_id: savedNotification.notification_id,
      member_id: memberId,
      delivery_status: 'SENT',
      delivered_at: new Date(),
    });

    await this.notificationRecipientRepository.save(recipient);
  }

  async listRoutes(): Promise<RouteResponseDto[]> {
    const routes = await this.routeRepository.find({
      order: { created_at: 'DESC' },
    });
    return routes.map(route => this.mapToRouteResponse(route));
  }

  private mapToRouteResponse(route: Route): RouteResponseDto {
    return {
      route_id: route.route_id,
      created_by_member: route.created_by_member,
      created_by_admin: route.created_by_admin,
      created_by_type: route.created_by_type,
      reviewed_by: route.reviewed_by,
      title: route.title,
      description: route.description,
      difficulty: route.difficulty,
      distance_km: route.distance_km ? Number(route.distance_km) : undefined,
      meeting_point: route.meeting_point,
      status: route.status,
      departure_date: route.departure_date,
      departure_time: route.departure_time,
      return_date: route.return_date,
      has_lodging: route.has_lodging,
      has_restaurant: route.has_restaurant,
      base_price: route.base_price ? Number(route.base_price) : undefined,
      lodging_price: route.lodging_price ? Number(route.lodging_price) : undefined,
      restaurant_price: route.restaurant_price ? Number(route.restaurant_price) : undefined,
      total_price: route.total_price ? Number(route.total_price) : undefined,
      route_data: route.route_data,
      reviewed_at: route.reviewed_at,
      created_at: route.created_at,
      updated_at: route.updated_at,
    };
  }
}
