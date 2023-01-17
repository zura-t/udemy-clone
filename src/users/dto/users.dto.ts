import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  roles: Role[];
}

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class AddRoleDto {
  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}
