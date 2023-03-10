import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() commentDto: CommentDto) {
    return await this.commentService.create(commentDto);
  }

  @Get()
  async findAll() {
    return await this.commentService.findAll();
  }

  @Patch(':id')
  async update(@Body() updateCommentDto: UpdateCommentDto) {
    return await this.commentService.update(updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.commentService.remove(id);
  }
}
