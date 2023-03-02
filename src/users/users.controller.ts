import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { ParamsValidationPipe } from '../pipes/params-validation.pipe';
import { AddRoleDto, UpdateProfileDto } from './dto/users.dto';
import { GetProfile } from './dto/users.return-dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get profile info' })
  @Get('profile')
  getProfile(@UserDecorator() user): Promise<GetProfile> {
    return this.usersService.findUserById(user.id);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':id')
  getUserById(@Param('id', ParamsValidationPipe) id: string) {
    return this.usersService.findUserById(id);
  }

  @ApiOperation({ summary: 'Update profile info' })
  @Patch()
  updateProfile(@Body() dto: UpdateProfileDto, @UserDecorator() user) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @ApiOperation({ summary: 'Add new role' })
  @Patch('addRole')
  addRoleToUser(@Body() dto: AddRoleDto, @UserDecorator() user) {
    return this.usersService.addRoleToUser(user.id, dto.role);
  }

  @ApiOperation({ summary: 'Delete account' })
  @Delete()
  deleteUser(@UserDecorator() user) {
    return this.usersService.deleteUser(user.id);
  }
}
