import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from '../comment.controller';
import { CommentService } from '../comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../comment.entity';
import { repositoryMock, requestMock } from '../../common/mock-data';
import { commentOne, commentThree, commentTwo } from '../constant';
import { CommentDto, FindCommentDto } from '../dto';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { USER_TWO_ID } from '../../user/constant';
import { ForbiddenException } from '@nestjs/common';

describe('CommentController', () => {
  let controller: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            create: jest.fn().mockImplementation(() => commentOne),
            findAll: jest.fn().mockImplementation(() => ({
              items: [commentTwo, commentThree],
              meta: {
                itemCount: 2,
                totalItems: 2,
                itemsPerPage: 2,
                totalPages: 1,
                currentPage: 1,
              },
            })),
            findOne: jest.fn().mockImplementation(() => commentOne),
            update: jest.fn().mockImplementation(() => commentOne),
            delete: jest.fn().mockImplementation(() => true),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment with the given parameters', async () => {
      const expected: CommentDto = { ...commentOne };

      const result = await controller.create({
        body: commentOne.body,
        blogPostId: commentOne.blogPostId,
        userId: commentOne.userId,
      });

      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return the only 2 comments in paginated form', async () => {
      const expected: Pagination<Comment, IPaginationMeta> = {
        items: [commentTwo as Comment, commentThree as Comment],
        meta: {
          itemCount: 2,
          totalItems: 2,
          itemsPerPage: 2,
          totalPages: 1,
          currentPage: 1,
        },
      };

      const dto: FindCommentDto = {
        limit: 15,
        page: 1,
        userId: commentTwo.userId,
        blogPostId: commentTwo.blogPostId,
        parentId: commentTwo.parentId,
      };

      const result = await controller.findAll(dto);

      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update a comment and return the updated comment', async () => {
      const request = {
        ...requestMock(),
        user: {
          id: commentOne.user.id,
          userType: commentOne.user.userType,
        },
      };

      const expected: CommentDto = { ...commentOne };

      const result = await controller.update(
        { id: commentOne.id, body: commentOne.body },
        request,
      );

      expect(result).toEqual(expected);
    });

    it('should throw an error for not being the author or an admin', async () => {
      expect.assertions(1);
      try {
        const request = {
          ...requestMock(),
          user: {
            id: USER_TWO_ID,
            userType: commentOne.user.userType,
          },
        };

        await controller.update(
          { id: commentOne.id, body: commentOne.body },
          request,
        );
      } catch (e) {
        expect(e).toEqual(
          new ForbiddenException({
            statusCode: 403,
            message:
              'Forbidden. You have the be the author of the comment or an admin.',
          }),
        );
      }
    });
  });

  describe('delete', () => {
    it('should delete a comment returning true as a response', async () => {
      const request = {
        ...requestMock(),
        user: {
          id: commentOne.user.id,
          userType: commentOne.user.userType,
        },
      };

      const result = await controller.delete(commentOne.id, request);

      expect(result).toEqual(true);
    });

    it('should throw an error for not being the author or an admin', async () => {
      expect.assertions(1);
      try {
        const request = {
          ...requestMock(),
          user: {
            id: USER_TWO_ID,
            userType: commentOne.user.userType,
          },
        };

        await controller.delete(commentOne.id, request);
      } catch (e) {
        expect(e).toEqual(
          new ForbiddenException({
            statusCode: 403,
            message:
              'Forbidden. You have the be the author of the comment or an admin.',
          }),
        );
      }
    });
  });
});
