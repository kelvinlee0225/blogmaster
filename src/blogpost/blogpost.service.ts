import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Blogpost } from './blogpost.entity';
import { BlogPostMapper } from './mapper/blogPost.mapper';
import { CreateBlogPostDto, UpdateBlogpostDto, BlogPostDto } from './dto';
import { CommentService } from '../comment/comment.service';
import { FindBlogPostDto } from './dto/find-blogpost.dto';

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

  async findBlogPostsIds(dto: FindBlogPostDto) {
    const whereParams = {};
    if (dto.userId) whereParams['userId'] = dto.userId;
    if (dto.title) whereParams['title'] = dto.title;
    if (dto.body) whereParams['body'] = dto.body;
    dto.limit = !!dto.limit ? dto.limit : 15;
    dto.page = !!dto.page ? dto.page : 1;

    const foundBlogPosts = await paginate(
      this.blogPostRepository,
      {
        limit: dto.limit,
        page: dto.page,
      },
      {
        where: whereParams,
      },
    );

    return {
      ids: foundBlogPosts.items.map((blogPost) => blogPost.id),
      meta: foundBlogPosts.meta,
    };
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

  async delete(id: string): Promise<boolean> {
    const foundBlogPost = await this.blogPostRepository.findOneOrFail({
      where: { id },
      relations: ['comments'],
    });

    const deletedBlogPost = await this.blogPostRepository.softRemove(
      foundBlogPost,
    );

    return !!deletedBlogPost.deletedAt ? true : false;
  }
}
