import { Module } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { BlogpostController } from './blogpost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogpost } from './blogpost.entity';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blogpost, Comment])],
  controllers: [BlogpostController],
  providers: [BlogpostService, CommentService],
  exports: [BlogpostService],
})
export class BlogpostModule {}
