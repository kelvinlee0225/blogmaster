import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../comment.service';
import { Comment } from '../comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../../common/mock-data';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { commentOne, commentTwo } from '../constant';
import {
  CommentDto,
  CreateCommentDto,
  FindCommentDto,
  UpdateCommentDto,
} from '../dto';
import { CommentMapper } from '../mapper/comment.mapper';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockImplementation(
    (
      _repository: Repository<Comment>,
      options: IPaginationOptions<IPaginationMeta>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _searchOptions?: FindOptionsWhere<Comment> | FindManyOptions<Comment>,
    ) => {
      return {
        items: +options.limit > 1 ? [commentOne, commentTwo] : [commentTwo],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: options.limit,
          totalPages: +options.limit > 1 ? 1 : 2,
          currentPage: options.page,
        },
      };
    },
  ),
  Pagination: jest.fn().mockImplementation(
    (
      items: CommentDto[],
      meta: IPaginationMeta,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _links?: IPaginationLinks,
    ) => ({
      items: items.length > 1 ? [commentOne, commentTwo] : [commentTwo],
      meta,
    }),
  ),
}));

describe('CommentService', () => {
  let service: CommentService;
  let repository: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            ...repositoryMock,
            findOneOrFail: jest
              .fn()
              .mockImplementation((options: FindOneOptions<Comment>) => {
                if (options.where['id'] === commentOne.id)
                  return { ...commentOne };
                throw new EntityNotFoundError(Comment, { options });
              }),
            findOneByOrFail: jest
              .fn()
              .mockImplementation(
                (
                  where:
                    | FindOptionsWhere<Comment>
                    | FindOptionsWhere<Comment>[],
                ) => {
                  if (where['id'] === commentOne.id) return { ...commentOne };
                  throw new EntityNotFoundError(Comment, { where });
                },
              ),
            find: jest.fn().mockImplementation(() => [commentOne, commentTwo]),
            save: jest.fn().mockImplementation(() => commentOne),
            softRemove: jest.fn().mockImplementation((entity: Comment) => {
              if (entity.deletedAt === null)
                return { ...commentOne, deletedAt: new Date() };
              return entity;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repository = await module.get(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment with the given parameters', async () => {
      const mapperSpy = jest.spyOn(CommentMapper, 'mapToDto');
      mapperSpy.mockImplementationOnce(() => commentOne);

      const expected: CommentDto = { ...commentOne };

      const createDto: CreateCommentDto = {
        body: commentOne.body,
        userId: commentOne.userId,
        blogPostId: commentOne.blogPostId,
      };

      const result = await service.create(createDto);

      expect(repository.save).toHaveBeenLastCalledWith(createDto);
      expect(mapperSpy).toHaveBeenLastCalledWith(commentOne);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    const findDto: FindCommentDto = {
      limit: 15,
      page: 1,
      userId: commentTwo.userId,
      blogPostId: commentTwo.blogPostId,
      parentId: commentTwo.parentId,
    };

    it('should return paginated comments with the given parameters', async () => {
      const mapperSpy = jest.spyOn(CommentMapper, 'mapToDtoArray');
      mapperSpy.mockImplementationOnce(() => [commentOne, commentTwo]);

      const paginationMeta: IPaginationMeta = {
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 15,
        totalPages: 1,
        currentPage: 1,
      };

      const result = await service.findAll(findDto);

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: 15, page: 1 },
        {
          relations: ['user'],
          where: {
            userId: commentTwo.userId,
            blogPostId: commentTwo.blogPostId,
            parentId: commentTwo.parentId,
          },
        },
      );
      expect(mapperSpy).toHaveBeenLastCalledWith([commentOne, commentTwo]);
      expect(Pagination).toHaveBeenLastCalledWith(
        [commentOne, commentTwo],
        paginationMeta,
      );
      expect(result).toEqual({
        items: [commentOne, commentTwo],
        meta: paginationMeta,
      });
    });

    it('should only return paginated comments, but only the second comment', async () => {
      const mapperSpy = jest.spyOn(CommentMapper, 'mapToDtoArray');
      mapperSpy.mockImplementationOnce(() => [commentTwo]);

      const paginationMeta: IPaginationMeta = {
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 1,
        totalPages: 2,
        currentPage: 2,
      };

      const result = await service.findAll({
        ...findDto,
        limit: 1,
        page: 2,
      });

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: 1, page: 2 },
        {
          relations: ['user'],
          where: {
            userId: commentTwo.userId,
            blogPostId: commentTwo.blogPostId,
            parentId: commentTwo.parentId,
          },
        },
      );
      expect(mapperSpy).toHaveBeenLastCalledWith([commentTwo]);
      expect(Pagination).toHaveBeenLastCalledWith([commentTwo], paginationMeta);
      expect(result).toEqual({
        items: [commentTwo],
        meta: paginationMeta,
      });
    });
  });

  describe('findOne', () => {
    it('should find a comment with the given id', async () => {
      const mapperSpy = jest.spyOn(CommentMapper, 'mapToDto');
      mapperSpy.mockImplementation(() => commentOne);

      const expected: CommentDto = { ...commentOne };

      const result = await service.findOne(commentOne.id);

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: { id: commentOne.id },
        relations: ['user'],
      });
      expect(mapperSpy).toHaveBeenLastCalledWith(commentOne);
      expect(result).toEqual(expected);
    });

    it('should throw EntityNotFoundError with the given id', async () => {
      expect.assertions(1);
      try {
        await service.findOne('123');
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(Comment, {
            options: {
              where: {
                id: '123',
              },
              relations: ['user'],
            },
          }),
        );
      }
    });
  });

  describe('findBlogPostsIds', () => {
    const findDto: FindCommentDto = {
      limit: 15,
      page: 1,
      userId: commentTwo.userId,
      blogPostId: commentTwo.blogPostId,
      parentId: commentTwo.parentId,
    };

    it('should find a comment that match with the given parameters', async () => {
      const expected = {
        ids: [commentTwo.id],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 1,
          totalPages: 2,
          currentPage: 1,
        },
      };

      const result = await service.findCommentIds({ ...findDto, limit: 1 });

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: 1, page: findDto.page },
        {
          where: {
            userId: commentTwo.userId,
            blogPostId: commentTwo.blogPostId,
            parentId: commentTwo.parentId,
          },
        },
      );
      expect(result).toEqual(expected);
    });

    it('should find multiple comments that match with the given parameters', async () => {
      const expected = {
        ids: [commentOne.id, commentTwo.id],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 15,
          totalPages: 1,
          currentPage: 1,
        },
      };
      const result = await service.findCommentIds(findDto);

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: findDto.limit, page: findDto.page },
        {
          where: {
            userId: commentTwo.userId,
            blogPostId: commentTwo.blogPostId,
            parentId: commentTwo.parentId,
          },
        },
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update a comment with the given parameters', async () => {
      const mapperSpy = jest.spyOn(CommentMapper, 'mapToDto');
      mapperSpy.mockReturnValue({ ...commentOne });

      const expected: CommentDto = { ...commentOne };

      const updateDto: UpdateCommentDto = {
        id: commentOne.id,
        body: commentOne.body,
      };

      const result = await service.update(updateDto);

      expect(repository.findOneByOrFail).toHaveBeenLastCalledWith({
        id: commentOne.id,
      });
      expect(repository.save).toHaveBeenLastCalledWith(commentOne);
      expect(mapperSpy).toHaveBeenLastCalledWith(commentOne);
      expect(result).toEqual(expected);
    });

    it('should throw an error with the given id', async () => {
      expect.assertions(1);
      try {
        await service.update({
          id: '123',
          body: commentOne.body,
        });
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(Comment, {
            where: {
              id: '123',
            },
          }),
        );
      }
    });
  });

  describe('delete', () => {
    it('should return true with the given id', async () => {
      const result = await service.delete(commentOne.id);

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: { id: commentOne.id },
        relations: ['children'],
      });
      expect(repository.softRemove).toHaveBeenLastCalledWith(commentOne);
      expect(result).toEqual(true);
    });
  });

  it('should return false with the given id', async () => {
    const softRemoveSpy = jest.spyOn(repository, 'softRemove');
    softRemoveSpy.mockImplementationOnce(async () => commentOne as Comment);

    const result = await service.delete(commentOne.id);

    expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
      where: { id: commentOne.id },
      relations: ['children'],
    });
    expect(repository.softRemove).toHaveBeenLastCalledWith(commentOne);
    expect(result).toEqual(false);
  });

  it('should throw an EntityNotFoundError with the given id', async () => {
    expect.assertions(1);
    try {
      await service.delete('123');

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: { id: '123' },
        relations: ['children'],
      });
    } catch (e) {
      expect(e).toEqual(
        new EntityNotFoundError(Comment, {
          options: {
            where: {
              id: '123',
            },
            relations: ['children'],
          },
        }),
      );
    }
  });
});
