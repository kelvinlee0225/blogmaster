import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { userOne, userTwo } from '../constant';
import { requestMock } from '../../common/mock-data';
import { User } from '../user.entity';
import { ForbiddenException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockImplementation(() => userOne),
            findOneById: jest.fn().mockImplementation(() => userOne),
            update: jest.fn().mockImplementation(() => userOne),
            delete: jest.fn().mockImplementation((id) => {
              if (id === userOne.id) return true;
              return false;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        email: userOne.email,
        username: userOne.username,
        password: userOne.password,
        userType: userOne.userType,
      };
      const result = await controller.signUp(dto);
      expect(result).toEqual(userOne);
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const result = await controller.findOneById(userOne.id);
      expect(result).toEqual(userOne);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = {
        id: userOne.id,
        email: userOne.email,
        username: userOne.username,
        password: userOne.password,
      };
      const request = {
        ...requestMock(),
        user: {
          id: userOne.id,
          userType: userOne.userType,
        },
      };
      const result = await controller.update(dto, request);
      expect(result).toEqual(userOne);
    });

    it('should throw a ForbiddenException if the user is not the author or an admin', async () => {
      expect.assertions(1);
      try {
        const request = {
          ...requestMock(),
          user: {
            id: userTwo.id,
            userType: userTwo.userType,
          },
        };

        await controller.update(
          { id: userTwo.id, username: userTwo.email },
          request,
        );
      } catch (e) {
        expect(e).toEqual(
          new ForbiddenException({
            statusCode: 403,
            message:
              'Forbidden. You have the be the author of the account or an admin.',
          }),
        );
      }
    });
  });

  describe('delete', () => {
    it('should delete an account returning true as a response', async () => {
      const request = {
        ...requestMock(),
        user: {
          id: userOne.id,
          userType: userOne.userType,
        },
      };

      const result = await controller.delete(userOne.id, request);

      expect(result).toEqual(true);
    });

    it('should throw an error for not being the author or an admin', async () => {
      expect.assertions(1);
      try {
        const request = {
          ...requestMock(),
          user: {
            id: userTwo.id,
            userType: userTwo.userType,
          },
        };

        await controller.delete(userTwo.id, request);
      } catch (e) {
        expect(e).toEqual(
          new ForbiddenException({
            statusCode: 403,
            message:
              'Forbidden. You have the be the author of the account or an admin.',
          }),
        );
      }
    });
  });
});
