import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Member } from '@domain/members/entities/member.entity';
import { AdminUser } from '@domain/members/entities/admin-user.entity';
import { AuthDomainService, MemberDomainService } from '@domain/members/services';
import { RegisterDto, LoginDto } from '../dtos';

describe('AuthService', () => {
  let service: AuthService;
  let memberRepository: any;
  let adminUserRepository: any;
  let authDomainService: any;
  let memberDomainService: any;
  let jwtService: any;

  beforeEach(async () => {
    memberRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    adminUserRepository = {
      findOne: jest.fn(),
    };

    authDomainService = {
      getOrCreateSocioRole: jest.fn(),
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    memberDomainService = {
      validateMemberEmail: jest.fn(),
      validateMemberDni: jest.fn(),
      generateMembershipNumber: jest.fn(),
      updateLastLogin: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Member),
          useValue: memberRepository,
        },
        {
          provide: getRepositoryToken(AdminUser),
          useValue: adminUserRepository,
        },
        {
          provide: AuthDomainService,
          useValue: authDomainService,
        },
        {
          provide: MemberDomainService,
          useValue: memberDomainService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new member', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        dni: '12345678A',
        birthDate: '1990-01-01',
        phone: '123456789',
        address: 'Test Address',
        city: 'Test City',
        postalCode: '28001',
      };

      const mockRole = { role_id: 1 };
      const mockMember = {
        member_id: 1,
        email: registerDto.email,
        first_name: registerDto.firstName,
        last_name: registerDto.lastName,
      };

      memberDomainService.validateMemberEmail.mockResolvedValue(true);
      memberDomainService.validateMemberDni.mockResolvedValue(true);
      authDomainService.getOrCreateSocioRole.mockResolvedValue(mockRole);
      authDomainService.hashPassword.mockResolvedValue('hashed_password');
      memberDomainService.generateMembershipNumber.mockResolvedValue('MEM001');
      memberRepository.create.mockReturnValue(mockMember);
      memberRepository.save.mockResolvedValue(mockMember);
      jwtService.sign.mockReturnValue('test_token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('member');
      expect(memberDomainService.validateMemberEmail).toHaveBeenCalledWith(registerDto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      memberDomainService.validateMemberEmail.mockResolvedValue(false);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login a member', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockMember = {
        member_id: 1,
        email: loginDto.email,
        password_hash: 'hashed_password',
        status: 'ACTIVE',
        first_name: 'John',
        last_name: 'Doe',
      };

      memberRepository.findOne.mockResolvedValue(mockMember);
      authDomainService.comparePassword.mockResolvedValue(true);
      memberDomainService.updateLastLogin.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('test_token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('member');
      expect(memberRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      memberRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockMember = {
        member_id: 1,
        email: loginDto.email,
        password_hash: 'hashed_password',
        status: 'ACTIVE',
      };

      memberRepository.findOne.mockResolvedValue(mockMember);
      authDomainService.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
