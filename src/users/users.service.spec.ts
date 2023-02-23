import { Test, TestingModule } from '@nestjs/testing';
import { Role, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { RegisterDto } from '../auth/dto/auth.dto';
import { PrismaService } from '../prisma.service';
import { GetProfile } from './dto/users.return-dto';
import {
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from './users.constants';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  const userId = randomUUID();
  const email = 'test@gmail.com';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user and return it', async () => {
      jest
        .spyOn(service, 'findUserByEmail')
        .mockImplementationOnce(jest.fn().mockResolvedValue(null));

      const mockUser = {
        id: userId,
        firstname: 'Test',
        lastname: 'User',
        email,
        password: '123',
        roles: [Role.Student],
      };
      const mockCreatedUser = jest.fn().mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.user, 'create')
        .mockImplementationOnce(mockCreatedUser);

      const dto: RegisterDto = {
        email,
        password: '123',
        firstname: 'Test',
        lastname: 'User',
        role: Role.Student,
      };
      const res = await service.createUser(dto);
      expect(res.email).toBe(dto.email);
    });

    it('should throw an error if the user already exists', async () => {
      const userExists = {
        id: userId,
        email,
        password: '123',
        firstname: 'Test',
        lastname: 'User',
        roles: [Role.Student],
        currentRefreshToken: '',
        avatar: null,
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const dto: RegisterDto = {
        email,
        password: '123',
        firstname: 'Test',
        lastname: 'User',
        role: Role.Student,
      };
      jest.spyOn(service, 'findUserByEmail').mockResolvedValue(userExists);
      expect(service.createUser(dto)).rejects.toThrowError(
        USER_ALREADY_EXISTS_ERROR,
      );
    });
  });

  describe('findUserById', () => {
    it('should return user by id (without password and refreshToken)', async () => {
      const userFound: User = {
        id: userId,
        email,
        firstname: 'Test',
        lastname: 'User',
        avatar: null,
        roles: [Role.Student],
        description: '',
        password: '123',
        currentRefreshToken: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const userReturned: GetProfile = {
        id: userId,
        email,
        firstname: 'Test',
        lastname: 'User',
        avatar: null,
        roles: [Role.Student],
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(userFound);
      const res = await service.findUserById(userId);
      expect(res).toEqual(userReturned);
    });

    it('should throw an error if the user not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      expect(service.findUserById(userId)).rejects.toThrowError(
        USER_NOT_FOUND_ERROR,
      );
    });
  });

  describe('findUserByEmail', () => {
    it('should return user by id', async () => {
      const userFound: User = {
        id: userId,
        email,
        firstname: 'Test',
        lastname: 'User',
        avatar: null,
        roles: [Role.Student],
        description: '',
        password: '123',
        currentRefreshToken: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(userFound);
      const res = await service.findUserByEmail(email);
      expect(res.id).toBe(userId);
    });

    it('should throw an error if the user not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      expect(service.findUserByEmail(email)).rejects.toThrowError(
        USER_NOT_FOUND_ERROR,
      );
    });
  });

  describe('setCurrentRefreshToken', () => {
    it('should update user refreshToken', async () => {
      const newToken = 'newToken';
      const userUpdated = {
        id: userId,
        email,
        firstname: 'Test',
        lastname: 'User',
        avatar: null,
        roles: [Role.Student],
        description: '',
        password: '123',
        currentRefreshToken: 'hashRefreshToken',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(userUpdated);
      await service.setCurrentRefreshToken(newToken, userId);

      expect(prismaService.user.update).toBeCalled();
      expect(
        service.setCurrentRefreshToken(newToken, userId),
      ).resolves.not.toThrow();
    });

    it('should throw an error if user not found', async () => {
      expect(
        service.setCurrentRefreshToken('newToken', userId),
      ).rejects.toThrowError();
    });
  });
});
