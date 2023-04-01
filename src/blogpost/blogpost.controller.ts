import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ISPUBLIC } from '../common/decorator';
import { UserType } from 'src/user/enums/user-type-enum';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { BlogpostService } from './blogpost.service';
import { CreateBlogPostDto } from './dto/create-blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BlogPost')
@UseGuards(JwtAuthGuard)
@Controller('blogpost')
export class BlogpostController {
  constructor(private readonly blogpostService: BlogpostService) {}

  @Post()
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return await this.blogpostService.create(createBlogPostDto);
  }

  @ISPUBLIC()
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
  ) {
    return await this.blogpostService.findAll(page, limit);
  }

  @ISPUBLIC()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogpostService.findOne(id);
  }

  @Patch()
  async update(@Body() updateBlogpostDto: UpdateBlogpostDto, @Request() req) {
    const foundBlogPost = await this.findOne(updateBlogpostDto.id);

    if (
      foundBlogPost.userId === req.user.id ||
      req.user.userType === UserType.ADMIN
    )
      return await this.blogpostService.update(updateBlogpostDto);

    throw new ForbiddenException({
      statusCode: 403,
      message:
        'Forbidden. You have the be the author of the blog post or an admin.',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const foundBlogPost = await this.findOne(id);

    if (
      foundBlogPost.userId === req.user.id ||
      req.user.userType === UserType.ADMIN
    )
      return await this.blogpostService.remove(id);

    throw new ForbiddenException({
      statusCode: 403,
      message:
        'Forbidden. You have the be the author of the blog post or an admin.',
    });
  }
}
