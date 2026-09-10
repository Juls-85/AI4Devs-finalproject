import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '@domain/members/entities/admin-user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.sub) {
      throw new ForbiddenException('No autorizado');
    }

    const adminUser = await this.adminRepository.findOne({
      where: { member_id: user.sub },
    });

    if (!adminUser || adminUser.status !== 'ACTIVE') {
      throw new ForbiddenException('No tienes permiso para realizar esta acción');
    }

    request.adminId = adminUser.admin_id;
    return true;
  }
}
