import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import {
  CommentDto,
  CreateCommentDto,
  FindCommentDto,
  UpdateCommentDto,
} from './dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CommentMapper } from './mapper/comment.mapper';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(commentDto: CreateCommentDto): Promise<CommentDto> {
    const newComment = new Comment(
      commentDto.body,
      commentDto.userId,
      commentDto.blogPostId,
    );
    if (commentDto.parentId) newComment.parentId = commentDto.parentId;
    const createdComment = await this.commentRepository.save(newComment);
    if (createdComment) return CommentMapper.mapToDto(createdComment);
  }

  async findAll(dto: FindCommentDto): Promise<Pagination<CommentDto>> {
    const whereParams = {};
    if (dto.userId) whereParams['userId'] = dto.userId;
    if (dto.blogPostId) whereParams['blogPostId'] = dto.blogPostId;
    if (dto.parentId) whereParams['parentId'] = dto.parentId;

    const foundComments = await paginate(
      this.commentRepository,
      {
        limit: +dto.limit ? +dto.limit : 20,
        page: +dto.page ? +dto.page : 1,
      },
      {
        relations: ['user'],
        where: whereParams,
      },
    );

    return new Pagination(
      CommentMapper.mapToDtoArray(foundComments.items),
      foundComments.meta,
    );
  }

  async findOne(id: string): Promise<CommentDto> {
    const foundComment = await this.commentRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });
    return CommentMapper.mapToDto(foundComment);
  }

  async findCommentIds(dto: FindCommentDto) {
    const whereParams = {};
    if (dto.userId) whereParams['userId'] = dto.userId;
    if (dto.blogPostId) whereParams['blogPostId'] = dto.blogPostId;
    if (dto.parentId) whereParams['parentId'] = dto.parentId;
    dto.limit = !!dto.limit ? dto.limit : 15;
    dto.page = !!dto.page ? dto.page : 1;

    const foundComments = await paginate(
      this.commentRepository,
      {
        limit: dto.limit,
        page: dto.page,
      },
      {
        where: whereParams,
      },
    );

    return {
      ids: foundComments.items.map((comment) => comment.id),
      meta: foundComments.meta,
    };
  }

  async update(updateCommentDto: UpdateCommentDto): Promise<CommentDto> {
    const foundComment = await this.commentRepository.findOneByOrFail({
      id: updateCommentDto.id,
    });

    foundComment.body = updateCommentDto.body;
    const updatedComment = await this.commentRepository.save(foundComment);
    return CommentMapper.mapToDto(updatedComment);
  }

  async delete(id: string): Promise<boolean> {
    const foundBlogPost = await this.commentRepository.findOneOrFail({
      where: { id },
      relations: ['children'],
    });

    const deletedBlogPost = await this.commentRepository.softRemove(
      foundBlogPost,
    );

    return !!deletedBlogPost.deletedAt ? true : false;
  }
}
