import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Blogpost } from './blogpost.entity';
import { BlogPostMapper } from './mapper/blogPost.mapper';
import { CreateBlogPostDto, UpdateBlogpostDto, BlogPostDto } from './dto';

@Injectable()
export class BlogpostService {
  constructor(
    @InjectRepository(Blogpost)
    private blogPostRepository: Repository<Blogpost>,
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
    if (foundBlogPost) return BlogPostMapper.mapToDto(foundBlogPost);
    return;
  }

  async update(updateBlogpostDto: UpdateBlogpostDto): Promise<BlogPostDto> {
    const foundBlogPost = await this.blogPostRepository.findOneByOrFail({
      id: updateBlogpostDto.id,
    });
    if (foundBlogPost) {
      if (updateBlogpostDto.title)
        foundBlogPost.title = updateBlogpostDto.title;
      if (updateBlogpostDto.body) foundBlogPost.body = updateBlogpostDto.body;

      const updatedBlogPost = await this.blogPostRepository.save(foundBlogPost);
      return BlogPostMapper.mapToDto(updatedBlogPost);
    }
  }

  async remove(id: string): Promise<boolean> {
    const deletedBlogPost = await this.blogPostRepository.softDelete({ id });
    return deletedBlogPost.affected ? true : false;
  }
}
