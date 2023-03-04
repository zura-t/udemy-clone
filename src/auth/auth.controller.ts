import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { UserDecorator } from 'src/decorators/user.decorator';
import JwtRefreshGuard from 'src/guards/jwt-refresh.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res) {
    return this.authService.register(dto, res);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @UserDecorator() user,
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(user, res);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@UserDecorator() user) {
    const access_token = await this.authService.generateAccessToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
    return {
      access_token,
    };
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(200)
  async logOut(@UserDecorator() user, @Res({ passthrough: true }) res) {
    return this.authService.logout(user.id, res);
  }
}
