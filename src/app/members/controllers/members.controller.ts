import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MembersService } from '../services/members.service';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { MemberResponseDto } from '../dtos/member-response.dto';
import { JwtGuard } from '@shared/security/guards/jwt.guard';

interface AuthRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
}

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @Get(':memberId')
  @UseGuards(JwtGuard)
  async getMember(@Param('memberId') memberId: string): Promise<MemberResponseDto> {
    return this.membersService.getMember(memberId);
  }

  @Put(':memberId')
  @UseGuards(JwtGuard)
  async updateMember(
    @Param('memberId') memberId: string,
    @Body() updateDto: UpdateMemberDto,
  ): Promise<MemberResponseDto> {
    return this.membersService.updateMember(memberId, updateDto);
  }

  @Post(':memberId/picture')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new Error('Solo se permiten archivos de imagen'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadProfilePicture(
    @Param('memberId') memberId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MemberResponseDto> {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.membersService.updateProfilePicture(memberId, file.buffer);
  }
}
