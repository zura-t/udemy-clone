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
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
    res: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.createUser(dto);
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    const { refreshToken, refreshTokenCookie } =
      this.generateRefreshTokenWithCookie(payload);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    res.setHeader('Set-Cookie', [refreshTokenCookie]);
    const access_token = this.generateAccessToken(payload);
    return {
      access_token,
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

  async login(
    user: JWTPayload,
    res: Response,
  ): Promise<{ access_token: string }> {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    const { refreshToken, refreshTokenCookie } =
      this.generateRefreshTokenWithCookie(payload);
    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    res.setHeader('Set-Cookie', [refreshTokenCookie]);
    const access_token = this.generateAccessToken(payload);
    return {
      access_token,
    };
  }

  async logout(userId: string, res: Response) {
    await this.usersService.removeRefreshToken(userId);
    res.setHeader('Set-Cookie', this.getCookiesForLogOut());
    return 'You logged out';
  }

  generateAccessToken(payload: JWTPayload) {
    return this.jwtService.sign(payload);
  }

  generateRefreshTokenWithCookie(payload: JWTPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
    });
    const cookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return { refreshToken, refreshTokenCookie: cookie };
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
