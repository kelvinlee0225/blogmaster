import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { BlogpostService } from './blogpost.service';
import { BlogPostDto } from './dto/blogpost.dto';
import { UpdateBlogpostDto } from './dto/update-blogpost.dto';

@Controller('blogpost')
export class BlogpostController {
  constructor(private readonly blogpostService: BlogpostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() blogPostDto: BlogPostDto) {
    return await this.blogpostService.create(blogPostDto);
  }

  @Get()
  async findAll() {
    return await this.blogpostService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogpostService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateBlogpostDto: UpdateBlogpostDto) {
    return await this.blogpostService.update(updateBlogpostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.blogpostService.remove(id);
  }
}
