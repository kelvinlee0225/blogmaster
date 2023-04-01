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
  ForbiddenException,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ISPUBLIC } from '../common/decorator';
import { UserType } from '../user/enums/user-type-enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth('access-token')
  @Post()
  async create(@Body() commentDto: CreateCommentDto) {
    return await this.commentService.create(commentDto);
  }

  @ISPUBLIC()
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
  ) {
    return await this.commentService.findAll(page, limit);
  }

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
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
