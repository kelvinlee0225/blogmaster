import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { repositoryMock } from '../../common/mock-data';
import {
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { constantUserType, userOne, userTwo } from '../constant';
import { CreateUserDto } from '../dto';
import { UserMapper } from '../mapper';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => {
    return userOne.password;
  }),
}));

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            ...repositoryMock,
            findOneOrFail: jest
              .fn()
              .mockImplementation((options: FindOneOptions<User>) => {
                if (options.where['id'] === userOne.id) return { ...userOne };
                throw new EntityNotFoundError(User, { options });
              }),
            findOneByOrFail: jest
              .fn()
              .mockImplementation(
                (where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) => {
                  if (where['id'] === userOne.id) return { ...userOne };
                  throw new EntityNotFoundError(User, { where });
                },
              ),
            find: jest.fn().mockImplementation(() => [userOne, userTwo]),
            save: jest.fn().mockImplementation(() => userOne),
            softRemove: jest.fn().mockImplementation((entity: User) => {
              if (entity.deletedAt === null)
                return { ...userOne, deletedAt: new Date() };
              return entity;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = await module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userMapper = jest.spyOn(UserMapper, 'mapToDto');
      userMapper.mockImplementation(() => userOne);

      const createUserDto: CreateUserDto = {
        email: userOne.email,
        username: userOne.username,
        password: userOne.password,
        userType: userOne.userType,
      };

      const result = await service.create(createUserDto);
      const expected: constantUserType = { ...userOne };

      expect(bcrypt.hash).toHaveBeenLastCalledWith(userOne.password, 10);
      expect(repository.save).toHaveBeenLastCalledWith(createUserDto);
      expect(userMapper).toHaveBeenLastCalledWith(userOne);
      expect(result).toEqual(expected);
    });
  });

  describe('findOneById', () => {
    it('should return a user with the given id', async () => {
      const userMapper = jest.spyOn(UserMapper, 'mapToDto');
      userMapper.mockImplementation(() => userOne);

      const result = await service.findOneById(userOne.id);
      const expected: constantUserType = { ...userOne };

      expect(repository.findOneByOrFail).toHaveBeenLastCalledWith({
        id: userOne.id,
      });
      expect(userMapper).toHaveBeenLastCalledWith(userOne);
      expect(result).toEqual(expected);
    });

    it('should throw an error with the given id', async () => {
      expect.assertions(1);
      try {
        await service.findOneById('123');
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(User, {
            where: {
              id: '123',
            },
          }),
        );
      }
    });
  });

  describe('findOne', () => {
    it('should return a user with the given id, email, or username', async () => {
      const userMapper = jest.spyOn(UserMapper, 'mapToDto');
      userMapper.mockImplementation(() => userOne);

      const result = await service.findOne({
        id: userOne.id,
        email: userOne.email,
        username: userOne.username,
      });
      const expected: constantUserType = { ...userOne };

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: {
          id: userOne.id,
          email: userOne.email,
          username: userOne.username,
        },
      });
      expect(userMapper).toHaveBeenLastCalledWith(userOne, false);
      expect(result).toEqual(expected);
    });

    it('should return a user with password by passing arguments like id, email, or username', async () => {
      const userMapper = jest.spyOn(UserMapper, 'mapToDto');
      userMapper.mockImplementation(() => userOne);

      const result = await service.findOne(
        {
          id: userOne.id,
          email: userOne.email,
          username: userOne.username,
        },
        true,
      );
      const expected: constantUserType = { ...userOne };

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: {
          id: userOne.id,
          email: userOne.email,
          username: userOne.username,
        },
      });
      expect(userMapper).toHaveBeenLastCalledWith(userOne, true);
      expect(result).toEqual(expected);
    });

    it('should throw an error with the given parameters', async () => {
      expect.assertions(1);
      try {
        await service.findOne({
          id: '123',
          email: userOne.email,
          username: userOne.username,
        });
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(User, {
            options: {
              where: {
                id: '123',
                email: userOne.email,
                username: userOne.username,
              },
            },
          }),
        );
      }
    });
  });

  describe('update', () => {
    it('should return the updated user with the given id, email, or username', async () => {
      const userMapper = jest.spyOn(UserMapper, 'mapToDto');
      userMapper.mockImplementation(() => userOne);

      const result = await service.update({
        id: userOne.id,
        email: userOne.email,
        username: userOne.username,
        password: userOne.password,
      });
      const expected: constantUserType = { ...userOne };

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: { id: userOne.id },
      });
      expect(repository.save).toHaveBeenLastCalledWith(userOne);
      expect(userMapper).toHaveBeenLastCalledWith(userOne);
      expect(result).toEqual(expected);
    });

    it('should throw an error with the given parameters', async () => {
      expect.assertions(1);
      try {
        await service.update({
          id: '123',
          email: userOne.email,
          username: userOne.username,
        });
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(User, {
            options: {
              where: {
                id: '123',
              },
            },
          }),
        );
      }
    });
  });

  describe('delete', () => {
    it('should return true with the given id', async () => {
      const result = await service.delete(userOne.id);

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: { id: userOne.id },
        relations: ['blogPosts', 'blogPosts.comments'],
      });
      expect(repository.softRemove).toHaveBeenLastCalledWith(userOne);
      expect(result).toEqual(true);
    });

    it('should return false with the given id', async () => {
      const returnValue = {
        ...userOne,
      } as User;

      const softRemoveSpy = jest.spyOn(repository, 'softRemove');
      softRemoveSpy.mockImplementationOnce(async () => returnValue);

      const result = await service.delete(userOne.id);

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: { id: userOne.id },
        relations: ['blogPosts', 'blogPosts.comments'],
      });
      expect(repository.softRemove).toHaveBeenLastCalledWith(userOne);
      expect(result).toEqual(false);
    });

    it('should return false with the given id', async () => {
      expect.assertions(1);
      try {
        await service.delete('123');

        expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
          where: { id: '123' },
          relations: ['blogPosts', 'blogPosts.comments'],
        });
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(User, {
            options: {
              where: {
                id: '123',
              },
              relations: ['blogPosts', 'blogPosts.comments'],
            },
          }),
        );
      }
    });
  });
});
