import { Test, TestingModule } from '@nestjs/testing';
import { BlogpostController } from '../blogpost.controller';
import { BlogpostService } from '../blogpost.service';
import { BlogPostDto } from '../dto';
import { blogPostOne, blogPostTwo } from '../constant';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blogpost } from '../blogpost.entity';
import { repositoryMock, requestMock } from '../../common/mock-data';
import { USER_TWO_ID } from '../../user/constant';
import { ForbiddenException } from '@nestjs/common';

describe('BlogpostController', () => {
  let controller: BlogpostController;
  let blogPostService: BlogpostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogpostController],
      providers: [
        BlogpostService,
        {
          provide: getRepositoryToken(Blogpost),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    controller = module.get<BlogpostController>(BlogpostController);
    blogPostService = module.get<BlogpostService>(BlogpostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a blog post with the given parameters', async () => {
    const spyFindAll = jest.spyOn(blogPostService, 'create');
    spyFindAll.mockImplementation(async () => blogPostOne);

    const expected: BlogPostDto = { ...blogPostOne };

    const result = await controller.create({
      body: blogPostOne.body,
      title: blogPostOne.title,
      userId: blogPostOne.user.id,
    });

    expect(result).toEqual(expected);
  });

  it('should find the first and the only 2 blogposts', async () => {
    const spyFindAll = jest.spyOn(blogPostService, 'findAll');
    spyFindAll.mockImplementation(async () => {
      return {
        items: [blogPostOne, blogPostTwo],
        meta: {
          itemCount: 2,
          totalItems: 2,
          itemsPerPage: 2,
          totalPages: 1,
          currentPage: 1,
        },
      };
    });

    const expected: Pagination<BlogPostDto, IPaginationMeta> = {
      items: [blogPostOne, blogPostTwo],
      meta: {
        itemCount: 2,
        totalItems: 2,
        itemsPerPage: 2,
        totalPages: 1,
        currentPage: 1,
      },
    };

    const result = await controller.findAll(1, 2);

    expect(result).toEqual(expected);
  });

  it('should find a blogpost with the given id', async () => {
    const spyFindAll = jest.spyOn(blogPostService, 'findOne');
    spyFindAll.mockImplementation(async () => blogPostOne);

    const expected: BlogPostDto = { ...blogPostOne };

    const result = await controller.findOne(blogPostOne.id);

    expect(result).toEqual(expected);
  });

  describe('Update endpoint', () => {
    it('should update a blog post and return the updated blog post', async () => {
      const spyUpdate = jest.spyOn(blogPostService, 'update');
      spyUpdate.mockImplementation(async () => blogPostOne);

      const spyFindOne = jest.spyOn(controller, 'findOne');
      spyFindOne.mockImplementation(async () => blogPostOne);

      const request = {
        ...requestMock(),
        user: {
          id: blogPostOne.user.id,
          userType: blogPostOne.user.userType,
        },
      };

      const expected: BlogPostDto = { ...blogPostOne };

      const result = await controller.update(
        { id: blogPostOne.id, title: blogPostOne.title },
        request,
      );

      expect(result).toEqual(expected);
    });

    it('should throw an error for not being the author or an admin', async () => {
      expect.assertions(1);
      try {
        const spyFindOne = jest.spyOn(controller, 'findOne');
        spyFindOne.mockImplementation(async () => blogPostOne);

        const request = {
          ...requestMock(),
          user: {
            id: USER_TWO_ID,
            userType: blogPostOne.user.userType,
          },
        };

        await controller.update(
          { id: blogPostOne.id, title: blogPostOne.title },
          request,
        );
      } catch (e) {
        expect(e).toEqual(
          new ForbiddenException({
            statusCode: 403,
            message:
              'Forbidden. You have the be the author of the blog post or an admin.',
          }),
        );
      }
    });
  });

  describe('Delete endpoint', () => {
    it('should delete a blog post returning true as a response', async () => {
      const remove = jest.spyOn(blogPostService, 'remove');
      remove.mockImplementation(async () => true);

      const spyFindOne = jest.spyOn(controller, 'findOne');
      spyFindOne.mockImplementation(async () => blogPostOne);

      const request = {
        ...requestMock(),
        user: {
          id: blogPostOne.user.id,
          userType: blogPostOne.user.userType,
        },
      };

      const result = await controller.remove(blogPostOne.id, request);

      expect(result).toEqual(true);
    });

    it('should throw an error for not being the author or an admin', async () => {
      expect.assertions(1);
      try {
        const spyFindOne = jest.spyOn(controller, 'findOne');
        spyFindOne.mockImplementation(async () => blogPostOne);

        const request = {
          ...requestMock(),
          user: {
            id: USER_TWO_ID,
            userType: blogPostOne.user.userType,
          },
        };

        await controller.remove(blogPostOne.id, request);
      } catch (e) {
        expect(e).toEqual(
          new ForbiddenException({
            statusCode: 403,
            message:
              'Forbidden. You have the be the author of the blog post or an admin.',
          }),
        );
      }
    });
  });
});
