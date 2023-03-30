import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ISPUBLIC } from '../common/decorator';
import { UserType } from '../user/enums/user-type-enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() commentDto: CommentDto) {
    return await this.commentService.create(commentDto);
  }

  @ISPUBLIC()
  @Get()
  async findAll() {
    return await this.commentService.findAll();
  }

  @Patch()
  async update(@Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    const foundComment = await this.commentService.findOne(updateCommentDto.id);

    if (
      foundComment.userId === req.user.id ||
      req.user.userType === UserType.ADMIN
    )
      return await this.commentService.update(updateCommentDto);

    throw new ForbiddenException({
      statusCode: 403,
      message:
        'Forbidden. You have the be the author of the comment or an admin.',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const foundComment = await this.commentService.findOne(id);

    if (
      foundComment.userId === req.user.id ||
      req.user.userType === UserType.ADMIN
    )
      return await this.commentService.remove(id);

    throw new ForbiddenException({
      statusCode: 403,
      message:
        'Forbidden. You have the be the author of the comment or an admin.',
    });
  }
}
