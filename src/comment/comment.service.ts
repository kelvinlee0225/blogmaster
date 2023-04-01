import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentDto, CreateCommentDto, UpdateCommentDto } from './dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { CommentMapper } from './mapper/comment.mapper';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(commentDto: CreateCommentDto) {
    const newComment = new Comment(
      commentDto.body,
      commentDto.userId,
      commentDto.blogPostId,
    );
    if (commentDto.parentId) newComment.parentId = commentDto.parentId;
    const createdComment = await this.commentRepository.save(newComment);
    return createdComment;
  }

  async findAll(page: number, limit: number): Promise<Pagination<CommentDto>> {
    const foundComments = await paginate(
      this.commentRepository,
      {
        limit: limit,
        page: page,
      },
      {
        relations: ['user'],
      },
    );

    return new Pagination(
      CommentMapper.mapToDtoArray(foundComments.items),
      foundComments.meta,
    );
  }

  async findOne(id: string) {
    const foundComment = await this.commentRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });
    if (foundComment) return foundComment;
    return;
  }

  async update(updateCommentDto: UpdateCommentDto) {
    const foundComment = await this.commentRepository.findOneByOrFail({
      id: updateCommentDto.id,
    });

    if (foundComment) {
      foundComment.body = updateCommentDto.body;
      const updatedComment = this.commentRepository.save(foundComment);
      return updatedComment;
    }
  }

  async remove(id: string) {
    const parent = await this.commentRepository.find({
      where: { id },
      relations: ['children'],
    });
    const deletedComment = await this.commentRepository.softRemove(parent);
    return deletedComment.length > 0 ? true : false;
  }
}
