import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '@domain/members/entities/member.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { MemberResponseDto } from '../dtos/member-response.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(AdminUser)
    private adminUserRepository: Repository<AdminUser>,
  ) {}

  async getMember(memberId: string): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { member_id: memberId },
    });

    if (!member) {
      throw new NotFoundException('Miembro no encontrado');
    }

    return this.mapToMemberResponse(member);
  }

  async updateMember(memberId: string, updateDto: UpdateMemberDto): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { member_id: memberId },
    });

    if (!member) {
      throw new NotFoundException('Miembro no encontrado');
    }

    if (updateDto.firstName) {
      member.first_name = updateDto.firstName;
    }
    if (updateDto.lastName) {
      member.last_name = updateDto.lastName;
    }
    if (updateDto.birthDate !== undefined) {
      member.birth_date = updateDto.birthDate ? new Date(updateDto.birthDate) : undefined;
    }
    if (updateDto.phone !== undefined) {
      member.phone = updateDto.phone;
    }
    if (updateDto.address !== undefined) {
      member.address = updateDto.address;
    }
    if (updateDto.city !== undefined) {
      member.city = updateDto.city;
    }
    if (updateDto.postalCode !== undefined) {
      member.postal_code = updateDto.postalCode;
    }

    const updatedMember = await this.memberRepository.save(member);
    return this.mapToMemberResponse(updatedMember);
  }

  async updateProfilePicture(memberId: string, pictureBuffer: Buffer): Promise<MemberResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { member_id: memberId },
    });

    if (!member) {
      throw new NotFoundException('Miembro no encontrado');
    }

    member.profile_picture = pictureBuffer;
    const updatedMember = await this.memberRepository.save(member);
    return this.mapToMemberResponse(updatedMember);
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
