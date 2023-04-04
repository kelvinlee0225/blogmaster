import { Test, TestingModule } from '@nestjs/testing';
import { BlogpostController } from '../blogpost.controller';
import { BlogpostService } from '../blogpost.service';
import { BlogPostDto } from '../dto';
import { blogPostOne, blogPostTwo } from '../constant';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogpost } from '../blogpost.entity';

describe('BlogpostController', () => {
  let controller: BlogpostController;
  let blogPostService: BlogpostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Blogpost])],
      controllers: [BlogpostController],
      providers: [BlogpostService],
    }).compile();

    controller = module.get<BlogpostController>(BlogpostController);
    blogPostService = module.get<BlogpostService>(BlogpostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
});
