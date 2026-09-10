import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoutesService } from '../services/routes.service';
import { NotificationsService } from '../services/notifications.service';
import { CreateRouteDto, UpdateRouteDto, ReviewRouteProposalDto, CreateNotificationDto, RouteResponseDto } from '../dtos';
import { JwtGuard } from '@shared/security/guards/jwt.guard';
import { AdminGuard } from '@shared/security/guards/admin.guard';
import { RouteMedia } from '@domain/routes/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface AdminRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
  adminId?: string;
}

@Controller('admin/routes')
export class RoutesController {
  constructor(
    private routesService: RoutesService,
    private notificationsService: NotificationsService,
    @InjectRepository(RouteMedia)
    private routeMediaRepository: Repository<RouteMedia>,
  ) {}

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  async createRoute(@Body() createRouteDto: CreateRouteDto, @Request() req: AdminRequest): Promise<RouteResponseDto> {
    if (!req.adminId) {
      throw new BadRequestException('Admin ID no disponible');
    }
    return this.routesService.createRoute(createRouteDto, req.adminId);
  }

  @Put(':routeId')
  @UseGuards(JwtGuard, AdminGuard)
  async updateRoute(
    @Param('routeId') routeId: string,
    @Body() updateRouteDto: UpdateRouteDto,
    @Request() req: AdminRequest,
  ): Promise<RouteResponseDto> {
    if (!req.adminId) {
      throw new BadRequestException('Admin ID no disponible');
    }
    return this.routesService.updateRoute(routeId, updateRouteDto, req.adminId);
  }

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  async listRoutes(): Promise<RouteResponseDto[]> {
    return this.routesService.listRoutes();
  }

  @Get(':routeId')
  @UseGuards(JwtGuard, AdminGuard)
  async getRoute(@Param('routeId') routeId: string): Promise<RouteResponseDto> {
    return this.routesService.getRoute(routeId);
  }

  @Get('proposals/pending')
  @UseGuards(JwtGuard, AdminGuard)
  async listPendingProposals(): Promise<RouteResponseDto[]> {
    return this.routesService.listPendingProposals();
  }

  @Post(':routeId/review')
  @UseGuards(JwtGuard, AdminGuard)
  async reviewProposal(
    @Param('routeId') routeId: string,
    @Body() reviewDto: ReviewRouteProposalDto,
    @Request() req: AdminRequest,
  ): Promise<RouteResponseDto> {
    if (!req.adminId) {
      throw new BadRequestException('Admin ID no disponible');
    }
    return this.routesService.reviewProposal(routeId, reviewDto, req.adminId);
  }

  @Post(':routeId/media')
  @UseGuards(JwtGuard, AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|webm)$/)) {
          cb(new Error('Solo se permiten archivos de imagen o video'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadMedia(
    @Param('routeId') routeId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AdminRequest,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const mediaType = file.mimetype.startsWith('image') ? 'IMAGE' : 'VIDEO';
    const fileBuffer = file.buffer.toString('base64');
    const fileUrl = `data:${file.mimetype};base64,${fileBuffer}`;

    const media = this.routeMediaRepository.create({
      route_id: routeId,
      media_type: mediaType,
      file_url: fileUrl,
      cloud_key: file.originalname,
      uploaded_by: req.adminId,
      is_cover: false,
    });

    const savedMedia = await this.routeMediaRepository.save(media);

    return {
      media_id: savedMedia.media_id,
      route_id: savedMedia.route_id,
      media_type: savedMedia.media_type,
      cloud_key: savedMedia.cloud_key,
      is_cover: savedMedia.is_cover,
      created_at: savedMedia.created_at,
    };
  }

  @Post('notifications/send')
  @UseGuards(JwtGuard, AdminGuard)
  async sendNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @Request() req: AdminRequest,
  ): Promise<any> {
    if (!req.adminId) {
      throw new BadRequestException('Admin ID no disponible');
    }
    return this.notificationsService.createAndSendNotification(createNotificationDto, req.adminId);
  }

  @Get('notifications/history')
  @UseGuards(JwtGuard, AdminGuard)
  async getNotificationHistory(): Promise<any[]> {
    return this.notificationsService.getNotificationHistory();
  }
}
