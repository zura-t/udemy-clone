import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma.service';
import { GetProfile } from './dto/users.return-dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user profile', async () => {
    const userId = randomUUID();
    const user: GetProfile = {
      id: userId,
      email: 'test@example.com',
      firstname: 'Test',
      lastname: 'User',
      avatar: null,
      roles: [Role.Student],
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(usersService, 'findUserById').mockResolvedValue(user);

    const res = await controller.getProfile({ id: userId });
    expect(usersService.findUserById).toBeCalledWith(userId);
    expect(res).toEqual(user);
  });
});
