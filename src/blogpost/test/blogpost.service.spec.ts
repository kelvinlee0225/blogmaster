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
import { BlogPostDto } from '../dto';
import { BlogPostMapper } from '../mapper/blogPost.mapper';
import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CommentService } from '../../comment/comment.service';
import { Comment } from '../../comment/comment.entity';

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
            remove: jest.fn().mockImplementation(() => true),
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
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a blogpost with the given parameters', async () => {
    const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDto');
    mapperSpy.mockImplementationOnce(() => blogPostOne);

    const expected: BlogPostDto = { ...blogPostOne };

    const result = await service.create({
      title: blogPostOne.title,
      body: blogPostOne.body,
      userId: blogPostOne.userId,
    });

    expect(result).toEqual(expected);
  });

  describe('FindAll', () => {
    it('should return paginated blog posts with the given parameters', async () => {
      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        items: [blogPostOne, blogPostTwo],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });

    it('should only return paginated blog posts, but only the second blogpost', async () => {
      const result = await service.findAll(2, 1);
      expect(result).toEqual({
        items: [blogPostTwo],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 1,
          totalPages: 2,
          currentPage: 2,
        },
      });
    });
  });

  describe('FindOne', () => {
    it('should find a blogpost with the given id', async () => {
      const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDto');
      mapperSpy.mockImplementation(() => blogPostOne);

      const expected: BlogPostDto = { ...blogPostOne };

      const result = await service.findOne(blogPostOne.id);

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

  describe('Update', () => {
    it('should update a blogpost with the given parameters', async () => {
      const mapperSpy = jest.spyOn(BlogPostMapper, 'mapToDto');
      mapperSpy.mockReturnValue({ ...blogPostOne });

      const expected: BlogPostDto = { ...blogPostOne };
      const result = await service.update({
        id: blogPostOne.id,
        title: blogPostOne.title,
        body: blogPostOne.body,
      });

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

  describe('Remove', () => {
    it('should return true with the given id', async () => {
      const result = await service.remove(blogPostOne.id);

      expect(result).toEqual(true);
    });

    it('should return true with the given id, and deleting more than 15 comments', async () => {
      const findCommentsSpy = jest.spyOn(commentService, 'findCommentIds');
      findCommentsSpy.mockResolvedValueOnce({
        ids: [].fill(blogPostOne.id),
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

      const result = await service.remove(blogPostOne.id);

      expect(result).toEqual(true);
    });

    it('should return false with the given id', async () => {
      const result = await service.remove('123');

      expect(result).toEqual(false);
    });
  });
});
