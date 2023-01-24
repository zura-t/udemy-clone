import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Public } from '../decorators/public.decorator';
import { AddRoleDto, UpdateProfileDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@UserDecorator() user) {
    return this.usersService.findUserById(user.id);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Patch()
  updateProfile(@Body() dto: UpdateProfileDto, @UserDecorator() user) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('addRole')
  addRoleToUser(@Body() dto: AddRoleDto, @UserDecorator() user) {
    return this.usersService.addRoleToUser(user.id, dto.role);
  }

  @Delete()
  deleteUser(@UserDecorator() user) {
    return this.usersService.deleteUser(user.id);
  }
}
