import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { ROLE_EXISTS_ERROR, USER_NOT_FOUND_ERROR } from './users.constants';
import { UpdateProfileDto } from './dto/users.dto';

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

  async findUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    const { password, ...userToReturn } = user;
    return userToReturn;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
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
