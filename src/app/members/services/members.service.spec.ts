import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from '@domain/members/entities/member.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { UpdateMemberDto } from '../dtos/update-member.dto';

describe('MembersService', () => {
  let service: MembersService;
  let memberRepository: any;
  let adminUserRepository: any;

  beforeEach(async () => {
    memberRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    adminUserRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: memberRepository,
        },
        {
          provide: getRepositoryToken(AdminUser),
          useValue: adminUserRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  describe('getMember', () => {
    it('should return a member by id', async () => {
      const mockMember = {
        member_id: '1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'ACTIVE',
      };

      memberRepository.findOne.mockResolvedValue(mockMember);
      adminUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getMember('1');

      expect(result).toBeDefined();
      expect(result.email).toBe(mockMember.email);
      expect(memberRepository.findOne).toHaveBeenCalledWith({
        where: { member_id: '1' },
      });
    });

    it('should throw NotFoundException if member not found', async () => {
      memberRepository.findOne.mockResolvedValue(null);

      await expect(service.getMember('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMember', () => {
    it('should update member information', async () => {
      const memberId = '1';
      const updateDto: UpdateMemberDto = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '999999999',
      };

      const mockMember = {
        member_id: memberId,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '123456789',
        status: 'ACTIVE',
      };

      const updatedMember = { ...mockMember, ...updateDto };

      memberRepository.findOne.mockResolvedValue(mockMember);
      memberRepository.save.mockResolvedValue(updatedMember);
      adminUserRepository.findOne.mockResolvedValue(null);

      const result = await service.updateMember(memberId, updateDto);

      expect(result).toBeDefined();
      expect(memberRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if member not found during update', async () => {
      memberRepository.findOne.mockResolvedValue(null);

      const updateDto: UpdateMemberDto = { firstName: 'Updated' };

      await expect(service.updateMember('99', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfilePicture', () => {
    it('should update member profile picture', async () => {
      const memberId = '1';
      const pictureBuffer = Buffer.from('fake-image-data');

      const mockMember = {
        member_id: memberId,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        status: 'ACTIVE',
        profile_picture: null,
      };

      const updatedMember = { ...mockMember, profile_picture: pictureBuffer };

      memberRepository.findOne.mockResolvedValue(mockMember);
      memberRepository.save.mockResolvedValue(updatedMember);
      adminUserRepository.findOne.mockResolvedValue(null);

      const result = await service.updateProfilePicture(memberId, pictureBuffer);

      expect(result).toBeDefined();
      expect(memberRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        profile_picture: pictureBuffer,
      }));
    });

    it('should throw NotFoundException if member not found', async () => {
      memberRepository.findOne.mockResolvedValue(null);
      const pictureBuffer = Buffer.from('fake-image-data');

      await expect(service.updateProfilePicture('99', pictureBuffer)).rejects.toThrow(NotFoundException);
    });
  });
});
