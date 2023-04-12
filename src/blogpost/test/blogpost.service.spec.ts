import { Test, TestingModule } from '@nestjs/testing';
import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../blogpost.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMock } from '../../common/mock-data';
import { blogPostOne, blogPostTwo } from '../constant';
import {
  EntityNotFoundError,
  FindOneOptions,
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  UpdateResult,
} from 'typeorm';
import { BlogPostDto, CreateBlogPostDto, UpdateBlogpostDto } from '../dto';
import { BlogPostMapper } from '../mapper/blogPost.mapper';
import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CommentService } from '../../comment/comment.service';
import { Comment } from '../../comment/comment.entity';
import { commentOne, commentTwo } from '../../comment/constant';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FindBlogPostDto } from '../dto/find-blogpost.dto';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockImplementation(
    (
      _repository: Repository<Blogpost>,
      options: IPaginationOptions<IPaginationMeta>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _searchOptions?: FindOptionsWhere<Blogpost> | FindManyOptions<Blogpost>,
    ) => {
      return {
        items: +options.limit > 1 ? [blogPostOne, blogPostTwo] : [blogPostTwo],
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
      items: BlogPostDto[],
      meta: IPaginationMeta,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _links?: IPaginationLinks,
    ) => ({
      items: items.length > 1 ? [blogPostOne, blogPostTwo] : [blogPostTwo],
      meta,
    }),
  ),
}));

describe('BlogpostService', () => {
  let service: BlogpostService;
  let repository: Repository<Blogpost>;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogpostService,
        {
          provide: CommentService,
          useValue: {
            findCommentIds: jest.fn().mockImplementation(() => {
              return {
                ids: [commentOne.id, commentTwo.id],
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
          provide: getRepositoryToken(Blogpost),
          useValue: {
            ...repositoryMock,
            findOneOrFail: jest
              .fn()
              .mockImplementation((options: FindOneOptions<Blogpost>) => {
                if (options.where['id'] === blogPostOne.id)
                  return { ...blogPostOne };
                throw new EntityNotFoundError(Blogpost, { options });
              }),
            findOneByOrFail: jest
              .fn()
              .mockImplementation(
                (
                  where:
                    | FindOptionsWhere<Blogpost>
                    | FindOptionsWhere<Blogpost>[],
                ) => {
                  if (where['id'] === blogPostOne.id) return { ...blogPostOne };
                  throw new EntityNotFoundError(Blogpost, { where });
                },
              ),
            find: jest
              .fn()
              .mockImplementation(() => [blogPostOne, blogPostTwo]),
            save: jest.fn().mockImplementation(() => blogPostOne),
            softDelete: jest.fn().mockImplementation((id: string) => {
              const result: UpdateResult = {
                generatedMaps: [],
                raw: {},
                affected: 1,
              };
              if (id === blogPostOne.id) return result;
              return { ...result, affected: 0 };
            }),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<BlogpostService>(BlogpostService);
    repository = module.get(getRepositoryToken(Blogpost));
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a blogpost with the given parameters', async () => {
      const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDto');
      mapperSpy.mockImplementationOnce(() => blogPostOne);

      const expected: BlogPostDto = { ...blogPostOne };

      const createDto: CreateBlogPostDto = {
        title: blogPostOne.title,
        body: blogPostOne.body,
        userId: blogPostOne.userId,
      };

      const result = await service.create(createDto);

      expect(repository.save).toHaveBeenLastCalledWith(createDto);
      expect(mapperSpy).toHaveBeenLastCalledWith(blogPostOne);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return paginated blog posts with the given parameters', async () => {
      const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDtoArray');
      mapperSpy.mockImplementationOnce(() => [blogPostOne, blogPostTwo]);

      const paginationMeta: IPaginationMeta = {
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 10,
        totalPages: 1,
        currentPage: 1,
      };

      const result = await service.findAll(1, 10);

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: 10, page: 1 },
        { relations: ['user'] },
      );
      expect(mapperSpy).toHaveBeenLastCalledWith([blogPostOne, blogPostTwo]);
      expect(Pagination).toHaveBeenLastCalledWith(
        [blogPostOne, blogPostTwo],
        paginationMeta,
      );
      expect(result).toEqual({
        items: [blogPostOne, blogPostTwo],
        meta: paginationMeta,
      });
    });

    it('should only return paginated blog posts, but only the second blogpost', async () => {
      const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDtoArray');
      mapperSpy.mockImplementationOnce(() => [blogPostTwo]);

      const paginationMeta: IPaginationMeta = {
        totalItems: 2,
        itemCount: 2,
        itemsPerPage: 1,
        totalPages: 2,
        currentPage: 2,
      };

      const result = await service.findAll(2, 1);

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: 1, page: 2 },
        { relations: ['user'] },
      );
      expect(mapperSpy).toHaveBeenLastCalledWith([blogPostTwo]);
      expect(Pagination).toHaveBeenLastCalledWith(
        [blogPostTwo],
        paginationMeta,
      );
      expect(result).toEqual({
        items: [blogPostTwo],
        meta: paginationMeta,
      });
    });
  });

  describe('findOne', () => {
    it('should find a blogpost with the given id', async () => {
      const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDto');
      mapperSpy.mockImplementation(() => blogPostOne);

      const expected: BlogPostDto = { ...blogPostOne };

      const result = await service.findOne(blogPostOne.id);

      expect(repository.findOneOrFail).toHaveBeenLastCalledWith({
        where: { id: blogPostOne.id },
        relations: ['user'],
      });
      expect(mapperSpy).toHaveBeenLastCalledWith(blogPostOne);
      expect(result).toEqual(expected);
    });

    it('should throw EntityNotFoundError with the given id', async () => {
      expect.assertions(1);
      try {
        await service.findOne('123');
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(Blogpost, {
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
    it('should find a blogpost that match with the given parameters', async () => {
      const expected = {
        ids: [blogPostTwo.id],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 1,
          totalPages: 2,
          currentPage: 1,
        },
      };

      const findDto: FindBlogPostDto = {
        userId: blogPostTwo.userId,
        title: blogPostTwo.title,
        body: blogPostTwo.body,
        limit: 1,
        page: 1,
      };

      const result = await service.findBlogPostsIds(findDto);

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: findDto.limit, page: findDto.page },
        {
          where: {
            userId: findDto.userId,
            title: findDto.title,
            body: findDto.body,
          },
        },
      );
      expect(result).toEqual(expected);
    });

    it('should find multiple blogposts that match with the given parameters', async () => {
      const expected = {
        ids: [blogPostOne.id, blogPostTwo.id],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 15,
          totalPages: 1,
          currentPage: 1,
        },
      };

      const findDto: FindBlogPostDto = {
        userId: blogPostOne.userId,
        limit: 15,
        page: 1,
      };

      const result = await service.findBlogPostsIds(findDto);

      expect(paginate).toHaveBeenLastCalledWith(
        repository,
        { limit: findDto.limit, page: findDto.page },
        {
          where: {
            userId: findDto.userId,
            title: findDto.title,
            body: findDto.body,
          },
        },
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update a blogpost with the given parameters', async () => {
      const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDto');
      mapperSpy.mockReturnValue({ ...blogPostOne });

      const expected: BlogPostDto = { ...blogPostOne };

      const updateDto: UpdateBlogpostDto = {
        id: blogPostOne.id,
        title: blogPostOne.title,
        body: blogPostOne.body,
      };

      const result = await service.update(updateDto);

      expect(repository.findOneByOrFail).toHaveBeenLastCalledWith({
        id: blogPostOne.id,
      });
      expect(repository.save).toHaveBeenLastCalledWith(blogPostOne);
      expect(mapperSpy).toHaveBeenLastCalledWith(blogPostOne);
      expect(result).toEqual(expected);
    });

    it('should throw an error with the given id', async () => {
      expect.assertions(1);
      try {
        await service.update({
          id: '123',
          body: blogPostOne.body,
        });
      } catch (e) {
        expect(e).toEqual(
          new EntityNotFoundError(Blogpost, {
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
      const result = await service.delete(blogPostOne.id);

      expect(repository.softDelete).toHaveBeenLastCalledWith(blogPostOne.id);
      expect(result).toEqual(true);
    });

    it('should return true with the given id, and deleting more than 15 comments', async () => {
      const findCommentsSpy = jest.spyOn(commentService, 'findCommentIds');
      findCommentsSpy.mockResolvedValueOnce({
        ids: [].fill(commentOne.id, 0, 14),
        meta: {
          totalItems: 16,
          itemCount: 15,
          itemsPerPage: 15,
          totalPages: 2,
          currentPage: 1,
        },
      });
      findCommentsSpy.mockResolvedValueOnce({
        ids: [blogPostTwo.id],
        meta: {
          totalItems: 16,
          itemCount: 1,
          itemsPerPage: 15,
          totalPages: 2,
          currentPage: 2,
        },
      });

      const result = await service.delete(blogPostOne.id);

      expect(repository.softDelete).toHaveBeenLastCalledWith(blogPostOne.id);
      expect(result).toEqual(true);
    });

    it('should return false with the given id', async () => {
      const result = await service.delete('123');

      expect(repository.softDelete).toHaveBeenLastCalledWith('123');
      expect(result).toEqual(false);
    });
  });
});
