import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(commentDto: CommentDto) {
    const newComment = new Comment(
      commentDto.body,
      commentDto.userId,
      commentDto.blogPostId,
    );
    if (commentDto.parentId) newComment.parentId = commentDto.parentId;
    const createdComment = await this.commentRepository.save(newComment);
    return createdComment;
  }

  async findAll() {
    return await this.commentRepository.findAndCount();
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
