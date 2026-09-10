import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Member } from '@domain/members/entities/member.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { AuthDomainService, MemberDomainService } from '@domain/members/services';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dtos';
import { MemberResponseDto } from '../../members/dtos/member-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
    private authDomainService: AuthDomainService,
    private memberDomainService: MemberDomainService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, dni, birthDate, phone, address, city, postalCode } = registerDto;

    const isEmailValid = await this.memberDomainService.validateMemberEmail(email);
    if (!isEmailValid) {
      throw new ConflictException('Este correo electrónico ya está registrado');
    }

    if (dni) {
      const isDniValid = await this.memberDomainService.validateMemberDni(dni);
      if (!isDniValid) {
        throw new ConflictException('Este DNI ya está registrado');
      }
    }

    const socioRole = await this.authDomainService.getOrCreateSocioRole();
    const passwordHash = await this.authDomainService.hashPassword(password);
    const membershipNumber = await this.memberDomainService.generateMembershipNumber();

    const member = this.memberRepository.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      dni,
      birth_date: birthDate ? new Date(birthDate) : undefined,
      phone,
      address,
      city,
      postal_code: postalCode,
      membership_number: membershipNumber,
      role_id: socioRole.role_id,
      status: 'ACTIVE',
      last_login_at: new Date(),
    });

    const savedMember = await this.memberRepository.save(member);
    const token = this.generateToken(savedMember);

    return {
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      member: await this.mapToMemberResponse(savedMember),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const member = await this.memberRepository.findOne({
      where: { email },
    });

    if (!member) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos');
    }

    if (member.status !== 'ACTIVE') {
      throw new UnauthorizedException('La cuenta no está activa');
    }

    const isPasswordValid = await this.authDomainService.comparePassword(password, member.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos');
    }

    await this.memberDomainService.updateLastLogin(member.member_id);

    const token = this.generateToken(member);

    return {
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      member: await this.mapToMemberResponse(member),
    };
  }

  async changePassword(memberId: string, currentPassword: string, newPassword: string): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { member_id: memberId },
    });

    if (!member) {
      throw new BadRequestException('Miembro no encontrado');
    }

    const isPasswordValid = await this.authDomainService.comparePassword(currentPassword, member.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    const passwordHash = await this.authDomainService.hashPassword(newPassword);
    await this.memberRepository.update(
      { member_id: memberId },
      { password_hash: passwordHash },
    );
  }

  private generateToken(member: Member): string {
    const payload = {
      sub: member.member_id,
      email: member.email,
      role: 'SOCIO',
    };
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  private async mapToMemberResponse(member: Member): Promise<MemberResponseDto> {
    const adminUser = await this.adminUserRepository.findOne({
      where: { member_id: member.member_id },
    });

    return {
      memberId: member.member_id,
      roleId: member.role_id,
      email: member.email,
      firstName: member.first_name,
      lastName: member.last_name,
      dni: member.dni,
      birthDate: member.birth_date,
      phone: member.phone,
      address: member.address,
      city: member.city,
      postalCode: member.postal_code,
      membershipNumber: member.membership_number,
      status: member.status,
      createdAt: member.created_at,
      updatedAt: member.updated_at,
      lastLoginAt: member.last_login_at,
      profilePicture: member.profile_picture ? member.profile_picture.toString('base64') : undefined,
      isAdmin: adminUser ? adminUser.status === 'ACTIVE' : false,
    };
  }
}
