import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Blogpost } from './blogpost.entity';
import { BlogPostMapper } from './mapper/blogPost.mapper';
import { CreateBlogPostDto, UpdateBlogpostDto, BlogPostDto } from './dto';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class BlogpostService {
  constructor(
    @InjectRepository(Blogpost)
    private blogPostRepository: Repository<Blogpost>,
    private commentService: CommentService,
  ) {}

  async create(blogPostDto: CreateBlogPostDto): Promise<BlogPostDto> {
    const newBlogPost = new Blogpost(
      blogPostDto.title,
      blogPostDto.body,
      blogPostDto.userId,
    );
    const createdBlogPost = await this.blogPostRepository.save(newBlogPost);
    if (createdBlogPost) return BlogPostMapper.mapToDto(createdBlogPost);
  }

  async findAll(page: number, limit: number): Promise<Pagination<BlogPostDto>> {
    const foundBlogPosts = await paginate(
      this.blogPostRepository,
      {
        limit: limit,
        page: page,
      },
      {
        relations: ['user'],
      },
    );

    return new Pagination(
      BlogPostMapper.mapToDtoArray(foundBlogPosts.items),
      foundBlogPosts.meta,
    );
  }

  async findOne(id: string): Promise<BlogPostDto> {
    const foundBlogPost = await this.blogPostRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });
    return BlogPostMapper.mapToDto(foundBlogPost);
  }

  async update(updateBlogpostDto: UpdateBlogpostDto): Promise<BlogPostDto> {
    const foundBlogPost = await this.blogPostRepository.findOneByOrFail({
      id: updateBlogpostDto.id,
    });

    if (updateBlogpostDto.title) foundBlogPost.title = updateBlogpostDto.title;
    if (updateBlogpostDto.body) foundBlogPost.body = updateBlogpostDto.body;

    const updatedBlogPost = await this.blogPostRepository.save(foundBlogPost);
    return BlogPostMapper.mapToDto(updatedBlogPost);
  }

  async remove(id: string): Promise<boolean> {
    const deletedBlogPost = await this.blogPostRepository.softDelete(id);

    if (deletedBlogPost.affected > 0) {
      const toBeDeletedCommentsId = [];
      let page = 1;

      while (true) {
        const foundComments = await this.commentService.findCommentIds({
          blogPostId: id,
          parentId: null,
          limit: 15,
          page: page,
        });
        toBeDeletedCommentsId.push(...foundComments.ids);

        if (
          foundComments.meta.totalPages < 1 ||
          foundComments.meta.currentPage === foundComments.meta.totalPages
        )
          break;
        else page++;
      }

      if (toBeDeletedCommentsId.length > 0) {
        for (let i = 0; i < toBeDeletedCommentsId.length; i++)
          this.commentService.remove(toBeDeletedCommentsId[i]);
      }
      return true;
    }
    return false;
  }
}
