import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '@domain/routes/entities';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async logAction(
    entityType: string,
    entityId: string,
    action: string,
    payload: object,
    actorAdminId?: string,
    actorMemberId?: string,
  ): Promise<void> {
    const auditLog = this.auditRepository.create({
      entity_type: entityType,
      entity_id: entityId,
      action,
      payload,
      actor_admin_id: actorAdminId,
      actor_member_id: actorMemberId,
    });

    await this.auditRepository.save(auditLog);
  }
}
