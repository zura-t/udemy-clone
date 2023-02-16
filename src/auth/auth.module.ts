import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    LocalStrategy,
    JwtRefreshTokenStrategy,
    ConfigService
  ],
})
export class AuthModule {}
