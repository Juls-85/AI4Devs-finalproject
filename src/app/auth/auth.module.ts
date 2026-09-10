import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@domain/members/entities/member.entity';
import { Role } from '@domain/members/entities/role.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { AuthDomainService, MemberDomainService } from '@domain/members/services';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Role, AdminUser]),
  ],
  providers: [AuthService, AuthDomainService, MemberDomainService],
  controllers: [AuthController],
  exports: [AuthService, AuthDomainService, MemberDomainService],
})
export class AuthModule {}
