import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { ServiceMock, repositoryMock } from '../../common/mock-data';
import {
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { constantUserType, userOne, userTwo } from '../constant';
import { CreateUserDto } from '../dto';
import { UserMapper } from '../mapper';
import { CommentService } from '../../comment/comment.service';
import { Comment } from '../../comment/comment.entity';
import { BlogpostService } from '../../blogpost/blogpost.service';
import { blogPostOne, blogPostTwo } from '../../blogpost/constant';
import { Blogpost } from '../../blogpost/blogpost.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => {
    return userOne.password;
  }),
}));

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let blogPostService: BlogpostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: BlogpostService,
          useValue: {
            findBlogPostsIds: jest.fn().mockImplementation(() => {
              return {
                ids: [blogPostOne.id, blogPostTwo.id],
                meta: {
                  totalItems: 2,
                  itemCount: 2,
                  itemsPerPage: 15,
                  totalPages: 1,
                  currentPage: 1,
                },
              };
            }),
            delete: jest.fn().mockImplementation(() => true),
          },
        },
        {
          provide: CommentService,
          useValue: ServiceMock,
        },
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
            softDelete: jest.fn().mockImplementation((id: string) => {
              const result: UpdateResult = {
                generatedMaps: [],
                raw: {},
                affected: 1,
              };
              if (id === userOne.id) return result;
              return { ...result, affected: 0 };
            }),
          },
        },
        {
          provide: getRepositoryToken(Blogpost),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = await module.get(getRepositoryToken(User));
    blogPostService = module.get<BlogpostService>(BlogpostService);
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

      expect(repository.softDelete).toHaveBeenLastCalledWith(userOne.id);
      expect(result).toEqual(true);
    });

    it('should return true with the given id, and deleting more than 15 blogPosts', async () => {
      const findBlogPostsSpy = jest.spyOn(blogPostService, 'findBlogPostsIds');
      findBlogPostsSpy.mockResolvedValueOnce({
        ids: [].fill(blogPostOne.id, 0, 14),
        meta: {
          totalItems: 16,
          itemCount: 15,
          itemsPerPage: 15,
          totalPages: 2,
          currentPage: 1,
        },
      });
      findBlogPostsSpy.mockResolvedValueOnce({
        ids: [blogPostTwo.id],
        meta: {
          totalItems: 16,
          itemCount: 1,
          itemsPerPage: 15,
          totalPages: 2,
          currentPage: 2,
        },
      });

      const result = await service.delete(userOne.id);

      expect(repository.softDelete).toHaveBeenLastCalledWith(userOne.id);
      expect(result).toEqual(true);
    });

    it('should return false with the given id', async () => {
      const result = await service.delete('123');

      expect(repository.softDelete).toHaveBeenLastCalledWith('123');
      expect(result).toEqual(false);
    });
  });
});
