import { Injectable } from '@nestjs/common';
import { JWTPayload, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import {
  INCORRECT_PASSWORD_ERROR,
  USER_ALREADY_EXISTS_ERROR,
} from '../users/users.constants';
import { USER_NOT_FOUND_ERROR } from 'src/users/users.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ access_token: string }> {
    const userExists = await this.usersService.findUserByEmail(dto.email);
    if (userExists) {
      throw new BadRequestException(USER_ALREADY_EXISTS_ERROR);
    }
    const user = await this.usersService.createUser(dto);
    const payload = { id: user.id, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException(INCORRECT_PASSWORD_ERROR);
    }
    return user;
  }

  login(user: JWTPayload): { access_token: string } {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
