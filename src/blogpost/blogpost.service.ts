import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blogpost } from './blogpost.entity';
import { BlogPostDto } from './dto/blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';

@Injectable()
export class BlogpostService {
  constructor(
    @InjectRepository(Blogpost)
    private blogPostRepository: Repository<Blogpost>,
  ) {}

  async create(blogPostDto: BlogPostDto) {
    const newBlogPost = new Blogpost(
      blogPostDto.title,
      blogPostDto.body,
      blogPostDto.userId,
    );
    const createdBlogPost = await this.blogPostRepository.save(newBlogPost);
    return createdBlogPost;
  }

  async findAll() {
    return await this.blogPostRepository.find();
  }

  async findOne(id: string) {
    const foundBlogPost = await this.blogPostRepository.findOneBy({ id });
    if (foundBlogPost) return foundBlogPost;
    return;
  }

  async update(updateBlogpostDto: UpdateBlogpostDto) {
    try {
      const foundBlogPost = await this.blogPostRepository.findOneBy({
        id: updateBlogpostDto.id,
      });
      if (foundBlogPost) {
        if (updateBlogpostDto.title)
          foundBlogPost.title = updateBlogpostDto.title;
        if (updateBlogpostDto.body) foundBlogPost.body = updateBlogpostDto.body;

        const updatedBlogPost = await this.blogPostRepository.save(
          foundBlogPost,
        );
        return updatedBlogPost;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async remove(id: string) {
    const deletedBlogPost = await this.blogPostRepository.softDelete({ id });
    return deletedBlogPost.affected ? true : false;
  }
}
