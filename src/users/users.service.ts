import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ROLE_EXISTS_ERROR, USER_NOT_FOUND_ERROR } from './users.constants';
import { UpdateProfileDto } from './dto/users.dto';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from '../auth/dto/auth.dto';
import { GetProfile } from './dto/users.return-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: RegisterDto): Promise<User> {
    const { password, role, ...dtoToSave } = dto;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(dto.password, salt);
    return this.prisma.user.create({
      data: { ...dtoToSave, password: hashPassword, roles: [role] },
    });
  }

  async findUserById(id: string): Promise<GetProfile> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    const { password, currentRefreshToken, ...userToReturn } = user;
    return userToReturn;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentRefreshToken: hashRefreshToken,
      },
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        currentRefreshToken: null,
      },
    });
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<string> {
    await this.prisma.user.update({ where: { id }, data: dto });
    return 'Profile was updated';
  }

  async addRoleToUser(id: string, role: Role): Promise<string> {
    const user = await this.findUserById(id);
    if (user.roles.includes(role)) {
      throw new BadRequestException(ROLE_EXISTS_ERROR);
    }
    await this.prisma.user.update({
      where: { id },
      data: { roles: { push: role } },
    });
    return 'User roles were updated';
  }

  async deleteUser(id: string): Promise<string> {
    await this.prisma.user.delete({ where: { id } });
    return 'User was deleted';
  }
}
